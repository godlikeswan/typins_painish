import { ReactNode } from "preact/compat";

import "./Page.css";

export const Page = (props: { children: ReactNode }) => {
    return <div class="Page">{props.children}</div>;
};
