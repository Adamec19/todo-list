import { useMediaQuery } from "@chakra-ui/react";

export interface IViewportContextValue {
  isMobile: boolean;
  isDesktop: boolean;
}

export default function useViewport(): IViewportContextValue {
  const [isMobile] = useMediaQuery(`(max-width: 576px)`);
  const [isDesktop] = useMediaQuery(`(min-width: 768px)`);

  return {
    isMobile: isMobile || false,
    isDesktop: isDesktop || false,
  };
}
