import React, { useState, useEffect, DragEvent } from 'react';

const partPrices: Record<string, number> = {
  'cpu-intel': 100,
  'cpu-amd': 100,
  'motherboard-intel': 150,
  'motherboard-amd': 150,
  'ram': 50,
  'cooler': 75,
  'gpu': 200,
};

type PartType = keyof typeof partPrices;

const alwaysCompatible = ['ram', 'cooler', 'gpu'];

const partImages: Record<PartType, string> = {
  'cpu-intel': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic1.makeuseofimages.com%2Fwordpress%2Fwp-content%2Fuploads%2F2016%2F03%2Fintel-skylake-cpu.jpg&f=1&nofb=1&ipt=6ad61732d96766d848d064947ec0409bc17bd12b2c7b5f30ce464fddab33e233',
  'cpu-amd': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpisces.bbystatic.com%2Fimage2%2FBestBuy_US%2Fimages%2Fproducts%2F6439%2F6439000cv11d.jpg&f=1&nofb=1&ipt=172f1518756840878ba5a83a26df9675beb1bbf5437dc837ab670cc5c7957863',
  'motherboard-intel': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fnews-cdn.softpedia.com%2Fimages%2Fnews2%2FIntel-Ultra-Thin-DH61AG-Mini-ITX-LGA-1155-Motherboard-Spotted-in-Retail-2.jpg&f=1&nofb=1&ipt=f7ec347fb29290fce015676416abaa318da40b466584c53f3ebb980ef35a280b',
  'motherboard-amd': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.idgesg.net%2Fimages%2Farticle%2F2017%2F07%2Fasrock-mini-itx-ryzen-b350-100729185-orig.jpg&f=1&nofb=1&ipt=f48cc320a9edba280000d30650f2be6ee9e1676d7d58718fbdc866ff8b85b3c8',
  'ram': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.learncomputerscienceonline.com%2Fwp-content%2Fuploads%2F2020%2F05%2FRandom-Access-Memory.jpg&f=1&nofb=1&ipt=418700aa8eba49f99dc7206e3041624bb0f429f5aaf63d2ad03537e5f266650e',
  'cooler': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.ZxOieP2kyF43KuW_N--0fQHaHa%26pid%3DApi&f=1&ipt=6f6733bfa990ded7c6b82136e3dd1f88b22d1a3742e0efcf4f237ad7295e5007',
  'gpu': 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.wccftech.com%2Fwp-content%2Fuploads%2F2022%2F06%2FNVIDIA-GeForce-RTX-4090-Ti-Graphics-Card-Pictures-Leak-_1-very_compressed-scale-6_00x-Custom-1536x826.png&f=1&nofb=1&ipt=6934d251edb0340eadb01e6836b406c005b58d77db6a87362c7d8d7e6d38273e',
};

const PCBuilderGame: React.FC = () => {
  const [money, setMoney] = useState<number>(0);
  const [inventory, setInventory] = useState<PartType[]>([]);
  const [buildArea, setBuildArea] = useState<PartType[]>([]);
  const [builtCompletePC, setBuiltCompletePC] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMoney(prev => prev + 10000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const refreshGame = () => {
    setMoney(0);
    setInventory([]);
    setBuildArea([]);
    setBuiltCompletePC(false);
  };

  const buyPart = (type: PartType) => {
    const cost = partPrices[type];
    if (money >= cost) {
      setMoney(prev => prev - cost);
      setInventory(prev => [...prev, type]);
    } else {
      alert('Not enough money!');
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain') as PartType;

    if (buildArea.length >= 6) {
      alert('BOOM! Incompatible parts!');
      setBuildArea([]);
      return;
    }

    const newParts = [...buildArea, type];

    for (const existing of buildArea) {
      if (!isCompatible(existing, type)) {
        alert('BOOM! Incompatible parts!');
        setBuildArea([]);
        return;
      }
    }

    setBuildArea(newParts);

    // 🎯 Check if the build is complete
    const types = [...newParts];
    const hasCPU = types.some(t => t.includes('cpu'));
    const hasMotherboard = types.some(t => t.includes('motherboard'));
    const hasRAM = types.some(t => t.includes('ram'));
    const hasCooler = types.some(t => t.includes('cooler'));
    const hasGPU = types.some(t => t.includes('gpu'));

    if (hasCPU && hasMotherboard && hasRAM && hasCooler && hasGPU) {
      setBuiltCompletePC(true);
    }
  };

  const allowDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const drag = (e: DragEvent<HTMLDivElement>, type: PartType) => {
    e.dataTransfer.setData('text/plain', type);
  };

  const isCompatible = (part1: PartType, part2: PartType): boolean => {
    if (alwaysCompatible.some(p => part1.includes(p)) || alwaysCompatible.some(p => part2.includes(p))) {
      return true;
    }
    if ((part1.includes('cpu-intel') && part2.includes('motherboard-intel')) ||
        (part1.includes('motherboard-intel') && part2.includes('cpu-intel')) ||
        (part1.includes('cpu-amd') && part2.includes('motherboard-amd')) ||
        (part1.includes('motherboard-amd') && part2.includes('cpu-amd'))) {
      return true;
    }
    return false;
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1>PC Builder Game</h1>
      <h2>Money: ${money}</h2>
      <button onClick={refreshGame}>Refresh</button>

      <div style={{ display: 'inline-block', verticalAlign: 'top', margin: '20px' }}>
        <h2>Shop</h2>
        {Object.keys(partPrices).map((type) => (
          <div key={type} style={{ marginBottom: '10px' }}>
            <button onClick={() => buyPart(type as PartType)}>
              Buy {type.replace('-', ' ')} (${partPrices[type]})
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'inline-block', verticalAlign: 'top', margin: '20px' }}>
        <h2>Home</h2>
        <div id="inventory" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {inventory.map((type, index) => (
            <div
              key={index}
              style={{ margin: '10px', cursor: 'grab' }}
              draggable
              onDragStart={(e) => drag(e, type)}
              title={type.replace('-', ' ')} // Tooltip on hover
            >
              <img
                src={partImages[type]}
                alt={type}
                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80'; }}
              />
            </div>
          ))}
        </div>

        <h3>Build Area</h3>
        <div
          id="build-area"
          onDrop={handleDrop}
          onDragOver={allowDrop}
          style={{
            width: '300px',
            height: '300px',
            border: '2px dashed black',
            marginTop: '20px',
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: builtCompletePC ? '#e0ffe0' : 'transparent',
          }}
        >
          {builtCompletePC ? (
            <img
              src=" https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F61071PwV84L.jpg&f=1&nofb=1&ipt=62b28b713a0a68f0a687a1634902595504fc0118440b681d46f9c7b0fde48830 "
              alt="Built PC"
              style={{ width: '250px', height: '250px', objectFit: 'contain' }}
            />
          ) : (
            buildArea.map((type, index) => (
              <img
                key={index}
                src={partImages[type]}
                alt={type}
                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PCBuilderGame;
