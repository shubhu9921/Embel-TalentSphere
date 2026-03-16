export const isMobileDevice = () => {
    // Basic user agent check
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isUASelector = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

    // Check for touch capabilities
    const hasTouch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

    // Desktop mode on mobile browsers often hides the UA but keeps touch points
    // Most desktops don't have touch points, or if they do, they also have large screens.
    // Screen size can also be a hint, but modern mobiles have high resolution.
    // However, window.innerWidth and window.innerHeight in "Desktop mode" 
    // usually return the mobile screen width (e.g., 390 to 450px) 
    // unless they are explicitly scaled.

    const isSmallScreen = window.innerWidth <= 1024; // Tablets are usually <= 1024

    return isUASelector || (hasTouch && isSmallScreen);
};
