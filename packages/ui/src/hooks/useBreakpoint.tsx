import { createBreakpoint } from 'react-use';
import { screens } from '../screens';

export enum Breakpoint {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

export const breakpoints = {
  [Breakpoint.sm]: 0,
  [Breakpoint.md]: Number.parseInt(screens.md),
  [Breakpoint.lg]: Number.parseInt(screens.lg),
  [Breakpoint.xl]: Number.parseInt(screens.xl),
};

export const useBreakpoint = () => {
  const breakpoint = createBreakpoint(breakpoints)() as Breakpoint;

  const isAtLeast = (target: Breakpoint): boolean => {
    const currentBreakpointValue = breakpoints[breakpoint];
    const targetBreakpointValue = breakpoints[target];
    return currentBreakpointValue >= targetBreakpointValue;
  };

  return {
    breakpoint,
    isAtLeast,
  };
};
