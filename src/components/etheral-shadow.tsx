'use client';

import React, { useRef, useId, useEffect, CSSProperties } from 'react';
import { animate, useMotionValue, AnimationPlaybackControls } from 'framer-motion';

// Type definitions
interface ResponsiveImage {
    src: string;
    alt?: string;
    srcSet?: string;
}

interface AnimationConfig {
    preview?: boolean;
    scale: number;
    speed: number;
}

interface NoiseConfig {
    opacity: number;
    scale: number;
}

interface ShadowOverlayProps {
    type?: 'preset' | 'custom';
    presetIndex?: number;
    customImage?: ResponsiveImage;
    sizing?: 'fill' | 'stretch';
    color?: string;
    animation?: AnimationConfig;
    noise?: NoiseConfig;
    style?: CSSProperties;
    className?: string;
    showText?: boolean;
}

function mapRange(
    value: number,
    fromLow: number,
    fromHigh: number,
    toLow: number,
    toHigh: number
): number {
    if (fromLow === fromHigh) {
        return toLow;
    }
    const percentage = (value - fromLow) / (fromHigh - fromLow);
    return toLow + percentage * (toHigh - toLow);
}

const useInstanceId = (): string => {
    const id = useId();
    const cleanId = id.replace(/:/g, "");
    const instanceId = `shadowoverlay-${cleanId}`;
    return instanceId;
};

export function Component({
    sizing = 'fill',
    color = 'rgba(128, 128, 128, 1)',
    animation,
    noise,
    style,
    className,
    showText = true
}: ShadowOverlayProps) {
    const id = useInstanceId();
    const animationEnabled = animation && animation.scale > 0;
    const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
    const feTurbulenceRef = useRef<SVGFETurbulenceElement>(null);
    const hueRotateMotionValue = useMotionValue(0);
    const turbulenceMotionValue = useMotionValue(0);
    const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null);
    const turbulenceAnimation = useRef<AnimationPlaybackControls | null>(null);

    const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 80) : 0;
    // Slower, smoother animation duration
    const animationDuration = animation ? mapRange(animation.speed, 1, 100, 2000, 100) : 2000;
    const baseFreqX = animation ? mapRange(animation.scale, 0, 100, 0.001, 0.0005) : 0.001;
    const baseFreqY = animation ? mapRange(animation.scale, 0, 100, 0.004, 0.002) : 0.004;

    useEffect(() => {
        if (animationEnabled) {
            // Animate hue rotation
            if (feColorMatrixRef.current) {
            if (hueRotateAnimation.current) {
                hueRotateAnimation.current.stop();
            }
            hueRotateMotionValue.set(0);
            hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
                duration: animationDuration / 25,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0,
                ease: "linear",
                delay: 0,
                onUpdate: (value: number) => {
                    if (feColorMatrixRef.current) {
                        feColorMatrixRef.current.setAttribute("values", String(value));
                    }
                }
            });
            }

            // Animate turbulence for flowing waves - smoother animation
            if (feTurbulenceRef.current) {
                if (turbulenceAnimation.current) {
                    turbulenceAnimation.current.stop();
                }
                turbulenceMotionValue.set(0);
                // Use longer duration for smoother motion
                const smoothDuration = animationDuration * 2;
                turbulenceAnimation.current = animate(turbulenceMotionValue, 360, {
                    duration: smoothDuration,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 0,
                    ease: "linear",
                    delay: 0,
                    onUpdate: (value: number) => {
                        if (feTurbulenceRef.current) {
                            // Use radians for smoother sine/cosine calculations
                            const radians = (value * Math.PI) / 180;
                            // Smoother, more gradual frequency changes
                            const freqX = baseFreqX + Math.sin(radians * 0.5) * 0.0001;
                            const freqY = baseFreqY + Math.cos(radians * 0.3) * 0.0003;
                            feTurbulenceRef.current.setAttribute("baseFrequency", `${freqX},${freqY}`);
                            // Smoother seed animation - change more gradually
                            const seedValue = Math.floor((value / 360) * 10) % 10;
                            feTurbulenceRef.current.setAttribute("seed", String(seedValue));
                        }
                    }
                });
            }

            return () => {
                if (hueRotateAnimation.current) {
                    hueRotateAnimation.current.stop();
                }
                if (turbulenceAnimation.current) {
                    turbulenceAnimation.current.stop();
                }
            };
        }
    }, [animationEnabled, animationDuration, hueRotateMotionValue, turbulenceMotionValue, baseFreqX, baseFreqY]);

    return (
        <div
            className={className}
            style={{
                overflow: "hidden",
                position: "relative",
                width: "100%",
                height: "100%",
                ...style
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: -displacementScale,
                    filter: animationEnabled ? `url(#${id}) blur(2px)` : "none",
                    willChange: animationEnabled ? "filter" : "auto",
                    transform: "translateZ(0)", // Force GPU acceleration for smoother animation
                    backfaceVisibility: "hidden"
                }}
            >
                {animationEnabled && (
                    <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
                        <defs>
                            <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
                                <feTurbulence
                                    ref={feTurbulenceRef}
                                    result="undulation"
                                    numOctaves="2"
                                    baseFrequency={`${baseFreqX},${baseFreqY}`}
                                    seed="0"
                                    type="turbulence"
                                />
                                <feColorMatrix
                                    ref={feColorMatrixRef}
                                    in="undulation"
                                    type="hueRotate"
                                    values="180"
                                />
                                <feColorMatrix
                                    in="dist"
                                    result="circulation"
                                    type="matrix"
                                    values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                                />
                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="circulation"
                                    scale={displacementScale}
                                    result="dist"
                                />
                                <feDisplacementMap
                                    in="dist"
                                    in2="undulation"
                                    scale={displacementScale}
                                    result="output"
                                />
                            </filter>
                        </defs>
                    </svg>
                )}
                <div
                    style={{
                        backgroundColor: color,
                        maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
                        maskSize: sizing === "stretch" ? "100% 100%" : "cover",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        width: "100%",
                        height: "100%",
                        transition: "background-color 0.3s ease"
                    }}
                />
            </div>

            {showText && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        zIndex: 10
                    }}
                >
                    <h1 className="md:text-7xl text-6xl lg:text-8xl font-bold text-center text-foreground relative z-20">
                        Etheral Shadows
                    </h1>
                </div>
            )}

            {noise && noise.opacity > 0 && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
                        backgroundSize: noise.scale * 200,
                        backgroundRepeat: "repeat",
                        opacity: noise.opacity / 2
                    }}
                />
            )}
        </div>
    );
}