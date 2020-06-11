const PromiseSource = require("./index").default;

try {
    // Test resolve
    // --------------------------------------------------------------------------------------------------------------
    let p1 = new PromiseSource();

    p1.promise.then(val => {
        if (val !== 999) {
            throw new Error("Failed: Resolved value is correct");
        }
    })

    p1.resolve(999);

    setTimeout(() => {
        if (!p1.resolved || !p2.completed) {
            throw new Error("Failed: Promise was resolved correctly");
        }
    });

    // Test reject
    // --------------------------------------------------------------------------------------------------------------
    let p2 = new PromiseSource();

    p2.promise.catch(reason => {
        if (!(reason instanceof Error) || reason.message !== "failed") {
            throw new Error("Failed: Reject reason is correct");
        }
    })

    p2.reject(new Error("failed"));

    setTimeout(() => {
        if (!p2.rejected || !p2.completed) {
            throw new Error("Failed: Promise was rejected correctly");
        }
    });

    // Test timeout
    // --------------------------------------------------------------------------------------------------------------
    let p3 = new PromiseSource(10);

    p3.promise.catch((reason) => {
        if (!(reason instanceof Error)) {
            throw new Error("Failed: Promise rejected with Error after timeout");
        }
    })
    
    setTimeout(() => {
        if (!p3.rejected || !p3.completed) {
            throw new Error("Failed: Promise rejected with Error after timeout");
        }
    }, 11);

    // Test repeatedly complete
    // --------------------------------------------------------------------------------------------------------------
    let p4 = new PromiseSource();
    p4.resolve();
    
    let catched = false;
    
    try {
        p4.resolve();
    }
    catch (e) {
        catched = true;
    }
    
    if (!catched) {
        throw new Error("Failed: Repeated completion cause Error");
    }
    
    
    setTimeout(() => {
        if (!p2.rejected || !p2.completed) {
            throw new Error("Failed: Promise was rejected correctly");
        }
    });
}
catch (e) {
    console.error(e.message);
    process.exit(1);
}

process.on("unhandledRejection", e => {
    console.error(e.message);
    process.exit(1);
});