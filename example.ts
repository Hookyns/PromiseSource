import PromiseSource from "./index";
function someAsyncAction(handler) {
	setTimeout(() => {
		handler(null, 666)
	}, 1000);
}

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