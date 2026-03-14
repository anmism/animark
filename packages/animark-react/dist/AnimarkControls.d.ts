import React from "react";
export interface AnimarkControlsTheme {
    container?: React.CSSProperties;
    button?: React.CSSProperties;
}
export interface AnimarkControlsProps {
    showNavigation?: boolean;
    showStepCount?: boolean;
    className?: string;
    style?: React.CSSProperties;
    theme?: AnimarkControlsTheme;
    labels?: {
        replay?: string;
        prev?: string;
        next?: string;
    };
    render?: (ctx: {
        playing: boolean;
        clickCount: number;
        totalClickSteps: number;
        replay: () => void;
        nextStep: () => void;
        prevStep: () => void;
    }) => React.ReactNode;
}
export declare function AnimarkControls({ showNavigation, showStepCount, className, style, theme, labels, render, }: AnimarkControlsProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=AnimarkControls.d.ts.map