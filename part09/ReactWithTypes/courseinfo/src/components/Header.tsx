import { HeaderProps } from "../types";

const Header = (props: HeaderProps) => {
    return <h1>{props.name}</h1>;
};

export default Header;
