
const testLookup = async (cedula) => {
  try {
    const url = `https://api.hacienda.go.cr/fe/ae?identificacion=${cedula}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(`Name for ${cedula}:`, data.nombre);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

testLookup('109870456');
