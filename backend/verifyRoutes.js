const base = process.env.BACKEND_URL || 'http://localhost:5000';
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNzFmNWZkMjAyMTFkMTVkMmFjZjBlZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NTkwMzI1NCwiZXhwIjoxNzg2NTA4MDU0fQ.8G5H6-iKVLO1m2tleyj93gTlMoRq4NlbUeS6uSb3ykA';

const log = (label, obj) => {
  console.log(`=== ${label} ===`);
  console.log(JSON.stringify(obj, null, 2));
};

const request = async (url, options = {}) => {
  const res = await fetch(base + url, options);
  const body = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    parsed = body;
  }
  return { url, status: res.status, body: parsed };
};

const run = async () => {
  const createData = {
    name: 'Partner Test',
    email: `partner-test-${Date.now()}@example.com`,
    phone: '9999999999',
    password: 'Partner@123',
    assignedArea: 'TestArea',
  };

  const createPartner = await request('/api/users/partners', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(createData),
  });

  log('CREATE PARTNER', createPartner);
  if (createPartner.status !== 201) return;

  const partnerId = createPartner.body.partner._id;
  const getPartner = await request(`/api/users/partners/${partnerId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  log('GET PARTNER BY ID', getPartner);

  const updatePartner = await request(`/api/users/partners/${partnerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: 'Partner Test Updated',
      phone: '9999999999',
      assignedArea: 'UpdatedArea',
      isActive: true,
    }),
  });
  log('UPDATE PARTNER', updatePartner);

  const courierData = {
    sender: { name: 'Test Sender', phone: '1111111111', address: '123 Main St' },
    receiver: { name: 'Test Receiver', phone: '2222222222', address: '456 Elm St' },
    assignedPartner: partnerId,
    expectedDeliveryDate: '2026-08-10',
  };

  const createCourier = await request('/api/couriers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(courierData),
  });
  log('CREATE COURIER', createCourier);
  if (createCourier.status !== 201) return;

  const courierId = createCourier.body.courier._id;
  const trackingNumber = createCourier.body.courier.trackingNumber;

  const getCourier = await request(`/api/couriers/${courierId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  log('GET COURIER BY ID', getCourier);

  const trackCourier = await request(`/api/couriers/track/${trackingNumber}`);
  log('TRACK COURIER', trackCourier);

  const loginPartner = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: createData.email, password: createData.password }),
  });
  log('PARTNER LOGIN', loginPartner);
  if (loginPartner.status !== 200) return;

  const partnerToken = loginPartner.body.token;
  const partnerShipments = await request('/api/partner/shipments', {
    method: 'GET',
    headers: { Authorization: `Bearer ${partnerToken}` },
  });
  log('PARTNER SHIPMENTS', partnerShipments);
};

run().catch((err) => {
  console.error('ERROR', err);
  process.exit(1);
});