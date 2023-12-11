export interface NavBarConfig {
    type: 'landing' | 'authenticated' | string; //See **navBarTypeOptions**
    expand?: boolean;
}

export const navBarTypeOptions = {
    landing: 'landing',
    authenticated: 'authenticated',
    blank: 'blank'
};


export const initialNavBarConfig = {
    type: navBarTypeOptions.blank,
    expand: false
};


export interface UrlRedirectConfig {
    default?: string;
}

export const initialUrlRedirectConfig = {
    default: '/shop'
}


export interface PageNavigation  {
    url: string;
    animated: boolean;
    animatedDirection?: 'forward' | 'back' | any;
    isRootPage?: boolean;
    data?: any;
}


export const initialPageNavigation: PageNavigation = {
    url: null,
    animated: null,
    animatedDirection: 'forward',
    isRootPage: false,
    data: null,
};




export interface LoadingModalConfig {
    show: boolean;
    message?: string;
    subMessage?: string;
}


export const initialLoadingModalConfig: LoadingModalConfig = {
    show: false,
    message: "Loading...",
    subMessage: null,
};
