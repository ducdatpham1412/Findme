import {useEffect, useState} from 'react';

const useCountdown = (initValue: number) => {
    const [countdown, setCountdown] = useState(initValue);

    useEffect(() => {
        let x: any;
        if (countdown > 0) {
            x = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(x);
    }, [countdown]);

    return {countdown, setCountdown};
};

export default useCountdown;
