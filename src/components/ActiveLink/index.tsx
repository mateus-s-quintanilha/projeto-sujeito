import { ReactElement, cloneElement } from 'react'
import Link, { LinkProps } from "next/link";
import { useRouter } from 'next/router';


interface ActiveLinkProps extends LinkProps{
    // children: ReactElement;
    activeClassName: string; 
    label: string;
}

export function ActiveLink({ activeClassName, label, ...rest }: ActiveLinkProps) {
    const route = useRouter()
    const className = route.asPath === rest.href  ? activeClassName : ''

    return (
        <Link {...rest} className={className}>
            {/* 
            {cloneElement(children, {
                className
            })} 
            */}
            {label}
        </Link>
    )
}