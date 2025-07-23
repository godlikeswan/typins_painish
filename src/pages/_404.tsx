import { FC } from "preact/compat";
import { useEffect } from "preact/hooks";
import { useNavigate } from "react-router";

export const NotFound = (): FC => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/");
    }, [navigate]);
    return null;
};
