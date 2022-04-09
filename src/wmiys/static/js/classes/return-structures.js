

/**
 * This is the base return class
 */
export class BaseReturn
{
    constructor(successful=false, error=null, data=null) {
        this.successful = successful;
        this.error = error;
        this.data = data;
    }
}