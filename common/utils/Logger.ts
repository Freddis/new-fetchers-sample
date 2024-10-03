export class Logger {
    private invoker: string;
    private onLogCallback: (msg: string) => any = () => {};
  
    constructor(invoker: string) {
      this.invoker = invoker
    }
  
    info(message: string, data?: object) {
      this.log(message,data)
    }

    error(message: string, error: unknown, data?: object) {
       this.log(message,data)
       console.log(error)
    }

    protected log(message: string, data?: object) {
        const now = new Date()
        const msg = `${now.toUTCString()} [${this.invoker}]: ${message}`
        console.log(msg)
        if(data){
            console.log(data)
        }
    }
  }