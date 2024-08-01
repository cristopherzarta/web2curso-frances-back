const  axios = require("axios");

 const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env
 const BASE_URL =  "https://api-m.sandbox.paypal.com"
 
 const  createOrder = async () => {
    const accessToken = await generateAccessToken();
    const url = `${BASE_URL}/v2/checkout/orders`;
    const { data } = await axios({
      url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "100.00",
            },
          },
        ],
      },
    });
    
    return data;
  }

  const capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken();
    const url = `${BASE_URL}/v2/checkout/orders/${orderId}/capture`;
    const { data } = await axios({
      url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    
    });
        return data;
  }
  
  async function generateAccessToken()  {
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET).toString("base64");
 
  try {
        const { data } = await axios({
          url : `${BASE_URL}/v1/oauth2/token`,
          method: "POST",
          data: "grant_type=client_credentials",
          headers: {
            Authorization: `Basic ${auth}`,
          },
        });
    return data.access_token
  } catch (error) {
    console.log({ error })
  }
     };

  module.exports = {
    createOrder,
    capturePayment,
  }