type LogLevel = 'debug' | 'info' | 'success' | 'error'

export class Logger {
  private readonly name: string
  private enabled: boolean

  public constructor(name: string, enabled = true) {
    this.name = name
    this.enabled = enabled
  }

  public static create(name: string): Logger {
    return new Logger(name)
  }

  public enable(): void {
    this.enabled = true
  }

  public disable(): void {
    this.enabled = false
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!this.enabled) return

    const prefix = `[${this.name}]`
    const timestamp = new Date().toISOString()

    switch (level) {
      case 'debug':
        console.debug(`${timestamp} ${prefix} ${message}`, ...args)
        break
      case 'info':
        console.info(`${timestamp} ${prefix} ${message}`, ...args)
        break
      case 'success':
        console.log(`${timestamp} ${prefix} ✓ ${message}`, ...args)
        break
      case 'error':
        console.error(`${timestamp} ${prefix} ✗ ${message}`, ...args)
        break
    }
  }

  public debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, ...args)
  }

  public info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args)
  }

  public success(message: string, ...args: unknown[]): void {
    this.log('success', message, ...args)
  }

  public error(message: string, ...args: unknown[]): void {
    this.log('error', message, ...args)
  }
}
