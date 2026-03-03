export function fadeIn(node, { duration = 200, delay = 0 } = {}) {
    return {
        duration,
        delay,
        css: (t) => `opacity: ${t}`,
    };
}

export function slideIn(node, { duration = 300, delay = 0 } = {}) {
    return {
        duration,
        delay,
        css: (t) => `transform: translateX(${(1 - t) * -20}px); opacity: ${t}`,
    };
}
