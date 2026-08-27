"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange?: (value: [number, number]) => void;
  onValueChange?: (value: [number, number]) => void;
  className?: string;
}

export function RangeSlider({
  min,
  max,
  step = 10,
  value,
  onChange,
  onValueChange,
  className,
}: RangeSliderProps) {
  const [minVal, maxVal] = value;

  const triggerChange = (newVal: [number, number]) => {
    onChange?.(newVal);
    onValueChange?.(newVal);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxVal - step);
    triggerChange([val, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minVal + step);
    triggerChange([minVal, val]);
  };

  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className={cn("relative w-full py-4", className)}>
      <div className="relative h-2 w-full rounded-full bg-muted">
        {/* Active Range Bar */}
        <div
          className="absolute h-full rounded-full bg-primary"
          style={{
            right: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={handleMinChange}
        className="pointer-events-none absolute top-3.5 h-3 w-full appearance-none bg-transparent accent-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={handleMaxChange}
        className="pointer-events-none absolute top-3.5 h-3 w-full appearance-none bg-transparent accent-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab"
      />
    </div>
  );
}

export { RangeSlider as Slider };
