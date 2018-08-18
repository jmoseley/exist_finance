import * as debug from 'debug';

const BASE = 'exist_plus_mint';

export class Log {
  constructor(private source: string) {}

  public generateMessage(level: string, message: string, source: string) {
    // Set the prefix which will cause debug to enable the message
    const namespace = `${BASE}:${level}`;
    const createDebug = debug(namespace);
    
    if(source) { createDebug(source, message); }
    else { createDebug(message); }
  }
  
  public trace(message: string, source?: string) {
    return this.generateMessage('trace', message, source || this.source);
  }
  
  public info(message: string, source?: string) {
    return this.generateMessage('info', message, source || this.source);
  }
  
  public warn(message: string, source?: string) {
    return this.generateMessage('warn', message, source || this.source);
  }
  
  public error(message: string, source?: string) {
    return this.generateMessage('error', message, source || this.source);
  }
}
