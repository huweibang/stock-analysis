declare global {  
    interface Window {  
        api: ApiInterface; // 这里 ApiInterface 需要是你自定义的接口  
    }  
}

export interface ApiInterface {  
    getWindowInfo: (callback: (width: number, height: number) => void) => void;  
    windowTop: () => void;  
    windowMin: () => void;  
    windowSetClose: () => void;  
    moduleFs: () => typeof fs;  
    moduleShell: () => typeof shell;  
}