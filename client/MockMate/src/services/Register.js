const container = {
            hidden: { opacity: 0 },
            visible: (i = 1) => ({
                opacity: 1,
                transition: {
                staggerChildren: 0.08,   // letters ka delay
                delayChildren: 0.2 * i,  // overall delay for different lines
                },
            }),
        };

        const letter = {
                hidden: { opacity: 0, y: 60 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                    type: "spring",
                    stiffness: 90,   // lower stiffness = smoother
                    damping: 20,     // smooth stop
                    mass: 0.8,
                    },
                },
        };

        const formVariant = {
            hidden: { opacity: 0, y : -100 },
            visible: { 
                opacity: 1, 
                y: 0,
                transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.3 } // delay so headings appear first
            }
        };

export {container, letter, formVariant};