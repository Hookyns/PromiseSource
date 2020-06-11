# Promise Completion Source
Promise manageable from outer scope, similar to C#'s TaskCompletionSource

## Synopsis
```typescript
class PromiseSource<TResult> {
    get promise(): Promise<TResult>;
    get resolved(): boolean;
    get rejected(): boolean;
    get completed(): boolean;
    constructor(timeout?: number);
    reject(reason?: any): void;
    resolve(value?: TResult): void;
}
```

## Example
```typescript
import PromiseSource from "promise-cs";

function doSomething(): Promise<number>
{
	let ps = new PromiseSource<number>(/* optional timeout in millisecond */);

	// Some async action, event or something
	someAsyncAction((err, result) => {
		if (err) {
			ps.reject(err);
			return;
		}
		
		ps.resolve(result);
	});

	return ps.promise;
}

doSomething()
	.then(num => console.log(num))
	.catch(reason => console.error(reason))
;
```