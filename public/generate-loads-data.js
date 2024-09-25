const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const readlineSync = require('readline-sync');

const additivesList = [
    "LUBRICITY",
    "CFI",
    "PDA",
    "IVD",
    "TOP TIER",
    "RED DYE",
    "DI",
    "DCI",
    "LED"
];
const productsList = [
    "A",
    "VRM",
    "NEP",
    "Q",
    "AR",
    "V66",
    "X",
    "ZB",
    "A5",
    "V3",
    "XHO",
    "B99",
    "AMS",
    "V3S",
    "D",
    "E",
    "ARM",
    "V2",
    "Y",
    "L",
    "V",
    "NR",
    "YM",
    "T",
    "V1"
];
const productDescriptionsList = [
    "A - 91 OCTANE without 10% ETHANOL",
    "VRM - Regular RBOB 85 OCTANE with 10% ETHANOL",
    "NEP - 87 OCTANE without 10% ETHANOL for export only",
    "Q - COMMERCIAL JET FUEL",
    "AR - PREMIUM RBOB 93 OCTANE with 10% ETHANOL",
    "V66 - 87 OCTANE with 10% ETHANOL low RVP",
    "X - #2 ULSD FUEL OIL 15PPM MAX SULFUR",
    "ZB - 100 % METHYL ESTER (BIO)",
    "A5 - 88.5 OCTANE without 10% ETHANOL",
    "V3 - 86 OCTANE with 10% ETHANOL",
    "XHO - #2 ULSD FUEL OIL 15PPM MAX SULFUR NTDF",
    "B99 - 99% METHYL ESTER (BIO)",
    "AMS - 88.5 OCTANE without 10% ETHANOL low RVP",
    "V3S - 86 OCTANE with 10% ETHANOL low RVP",
    "D - #2 ULSD PREMIUM DIESEL 15PPM MAX SULFUR",
    "E - ETHANOL",
    "ARM - Premium RBOB 88.5 OCTANE without 10% ETHANOL",
    "V2- 87 OCTANE with 10% ETHANOL",
    "Y - #1 ULSD FUEL OIL 15PPM MAX SULFUR",
    "L - PROPANE",
    "V - 87 OCTANE with 10% ETHANOL",
    "NR - RBOB - 87 OCTANE with 10% ETHANOL",
    "YM - # 1 ULSD FUEL OIL ROCKY MOUNTAIN SYSTEM",
    "T - TRANSMIX (L-loading O-off loading)",
    "V1 - 85 OCTANE with 10% ETHANOL"
];

const generateRandomId = () => {
    return uuidv4();
};

const generateRandomPO = () => {
    return `PO${Math.floor(10000 + Math.random() * 90000)}`;
};

const generateRandomCarrier = () => {
    const carriers = ['CarrierX', 'CarrierY', 'CarrierZ'];
    return carriers[Math.floor(Math.random() * carriers.length)];
};

const generateRandomFEIN = () => {
    return `${Math.floor(100000000 + Math.random() * 900000000)}`;
};

const generateRandomVTC = () => {
    return `VTC${Math.floor(1000 + Math.random() * 9000)}`;
};

const generateRandomBadge = () => {
    return `${Math.floor(100 + Math.random() * 900)}`;
};

const generateRandomStatus = () => {
    const statuses = ['Pending', 'In Progress', 'Completed'];
    return statuses[Math.floor(Math.random() * statuses.length)];
};

const generateRandomDate = () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    return futureDate.toISOString().slice(0, 16).replace('T', ' ');
};

const generateRandomSource = () => {
    const sources = ['SourceA', 'SourceB', 'SourceC'];
    return sources[Math.floor(Math.random() * sources.length)];
};

const generateRandomSpot = () => {
    const spots = ['A1', 'B2', 'C3', 'D4'];
    return spots[Math.floor(Math.random() * spots.length)];
};

const generateRandomDestination = () => {
    const destinations = ['Destination1', 'Destination2', 'Destination3'];
    return destinations[Math.floor(Math.random() * destinations.length)];
};

const generateRandomPetroex = () => {
    const petroexes = ['Petroex1', 'Petroex2', 'Petroex3'];
    return petroexes[Math.floor(Math.random() * petroexes.length)];
};

const generateRandomAdditives = () => {
    const numAdditives = Math.floor(Math.random() * 7); // 0 to 6 additives
    const selectedAdditives = [];
    for (let i = 0; i < numAdditives; i++) {
        const additive = additivesList[Math.floor(Math.random() * additivesList.length)];
        selectedAdditives.push({ name: additive, description: additive });
    }
    return selectedAdditives;
};

const generateRandomProducts = () => {
    const numProducts = Math.floor(1 + Math.random() * 6); // 1 to 6 products
    const selectedProducts = [];
    for (let i = 0; i < numProducts; i++) {
        const product = productsList[Math.floor(Math.random() * productsList.length)];
        const description = productDescriptionsList[productsList.indexOf(product)];
        selectedProducts.push({
            name: product,
            description: description,
            authorization: {
                supplier: {
                    id: generateRandomId(),
                    name: `Supplier${Math.floor(1 + Math.random() * 10)}`
                },
                petroex: generateRandomPetroex()
            }
        });
    }
    return selectedProducts;
};

const generateRandomCompartment = () => {
    return {
        recipe: recipes[Math.floor(Math.random() * recipes.length)],
        destination: generateRandomDestination(),
        gallons: Math.floor(100 + Math.random() * 900),
        additives: generateRandomAdditives(),
        products: generateRandomProducts()
    };
};
const recipes = [
    'Unleaded 87',
    'Unleaded 88',
    'Premium Unleaded',
    'Diesel',
    'E-85',
    'Ethanol-free gasoline'
];

const generateRandomLoad = (id) => {
    const carrier = generateRandomCarrier();
    return {
        id: generateRandomId(),
        spot: generateRandomSpot(),
        po: generateRandomPO(),
        carrier: carrier,
        fein: generateRandomFEIN(),
        vtc: generateRandomVTC(),
        badge: generateRandomBadge(),
        status: generateRandomStatus(),
        deliveryStart: generateRandomDate(),
        deliveryEnd: generateRandomDate(),
        audit: {
            createdBy: `User${Math.floor(1 + Math.random() * 10)}`,
            createdAt: generateRandomDate()
        },
        compartments: Array.from({ length: Math.floor(Math.random() * 7) }, generateRandomCompartment)
    };
};

const generateSampleData = (numLoads) => {
    const loads = [];
    for (let i = 0; i < numLoads; i++) {
        loads.push(generateRandomLoad(i));
    }
    return { loads };
};

const numLoads = readlineSync.questionInt('Enter the number of loads to generate: ');
const sampleData = generateSampleData(numLoads);

fs.writeFileSync('loads.json', JSON.stringify(sampleData, null, 2));
console.log(`Generated ${numLoads} loads and saved to loads.json`);