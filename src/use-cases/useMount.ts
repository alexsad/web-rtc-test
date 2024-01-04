import { useEffect, useRef } from "react";

const useMount = (fun: () => Promise<void>, condition = true) => {
    const firstFlow = useRef(true);
    useEffect(() => {
        if (condition && firstFlow.current) {
            firstFlow.current = false;
            fun();
        }
    }, [fun, condition]);
}

export { useMount };
