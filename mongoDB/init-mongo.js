let res = [
    db.elements.drop(),
    db.users.drop(),
    db.elements.createIndex({ name: 1 }, { unique: true}),
    db.elements.createIndex({ installed: 1 }),
    db.elements.createIndex({ lastCheckup: 1 }),
    db.elements.insert({
        name: "pump_0",
        model: "Pet Shop",
        location: "Cairo, Egypt",
        installed: Date.now(),
        lastCheckup: Date.now()
    }),
    db.elements.insert({
        name: "pump_1",
        model: "Za Warudo Ovah Havon",
        location: "Cairo, Egypt",
        installed: Date.now(),
        lastCheckup: Date.now()
    }),
    db.elements.insert({
        name: "sink_0",
        model: "Za Hando",
        location: "Morioh, Japan",
        installed: Date.now(),
        lastCheckup: Date.now()
    }),
    db.elements.insert({
        name: "sink_1",
        model: "Vanilla Ice - Cream",
        location: "Cairo, Egypt",
        installed: Date.now(),
        lastCheckup: Date.now()
    }),
    db.elements.insert({
        name: "basin_0",
        model: "Mr. President",
        location: "Rome, Italy",
        installed: Date.now(),
        lastCheckup: Date.now()
    }),
]

printjson(res)