/**
 * Promise manageable from outer scope
 */
export default class PromiseSource<TResult = void>
{
	/**
	 * Promise
	 * @internal
	 */
	private readonly _promise: Promise<TResult>;

	/**
	 * Resolve callback
	 * @internal
	 */
	private _resolve: (value?: (PromiseLike<TResult> | TResult)) => void;

	/**
	 * Reject callback
	 * @internal
	 */
	private _reject: (reason?: any) => void;

	/**
	 * Set after resolve
	 * @internal
	 */
	private _resolved: boolean;

	/**
	 * Set after reject
	 * @internal
	 */
	private _rejected: boolean;

	/**
	 * Timeout identifier
	 * @internal
	 */
	private _timeout?: number;

	/**
	 * Get managed Promise
	 */
	public get promise(): Promise<TResult>
	{
		return this._promise;
	}

	/**
	 * True when managed promise was resolved
	 */
	public get resolved(): boolean
	{
		return this._resolved;
	}

	/**
	 * True when managed promise was rejected
	 */
	public get rejected(): boolean
	{
		return this._rejected;
	}

	/**
	 * True when resolved or rejected
	 */
	public get completed()
	{
		return this._rejected || this._resolved;
	}

	/**
	 * Ctor
	 * @param {number} [timeout] Optional timeout
	 */
	constructor(timeout?: number)
	{
		this._promise = new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		})

		if (timeout != undefined)
		{
			this._timeout = setTimeout(() => {
				if (!this.completed)
				{
					this.reject(new Error("Promise timed out"));
				}
			}, ~~timeout);
		}
	}

	/**
	 * Reject managed promise
	 * @param reason
	 */
	public reject(reason?: any)
	{
		this.validateCompletion();

		this._reject(reason);
		this._rejected = true;

		this.dispose();
	}

	/**
	 * Resolve managed promise
	 * @param value
	 */
	public resolve(value?: TResult)
	{
		this._resolve(value);
		this._resolved = true;

		this.dispose();
	}

	/**
	 * Clear handlers
	 * @internal
	 */
	private dispose()
	{
		this._resolve = undefined;
		this._reject = undefined;

		if (this._timeout != undefined)
		{
			clearTimeout(this._timeout);
			this._timeout = undefined;
		}
	}

	/**
	 * Validate completion
	 * @internal
	 */
	private validateCompletion()
	{
		if (this.completed)
		{
			throw Error("PromiseSource was already " + (this._rejected ? "rejected" : "resolved") + ".");
		}
	}
}