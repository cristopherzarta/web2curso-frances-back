const express = require("express");
const router = express.Router();
const passport = require("passport");
const Sale = require("../models/sales");
const fs = require("fs");
const { createOrder, capturePayment } = require("../helpers/paypal");
const Notification = require("../models/notification");

//obtener las curso

router.post("/orders", passport.authenticate("jwt"), async (req, res) => {
  const { price, courseId } = req.body;
  const order = await createOrder();
  console.log({ order, user: req.user });
  const createdSale = await Sale.create({
    course: courseId,
    user: req.user._id,
    price,
    order_id: order.id,
    order_status: order.status,
  });
  res.json(order);
});

router.post("/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  const captureData = await capturePayment(orderID);
  console.log({ links: captureData.links });
  await Sale.findOneAndUpdate(
    { order_id: orderID },
    { order_status: "COMPLETED", payer: captureData.payer }
  );
  //SKJSKLAJDJKLSJLKJDSKLJDSLSKDLJSDKL
  res.json(captureData);
});

router.post("/webhook", async (req, res) => {
  res.status(200).send()

  console.log("NOTIFICATION RECIBIDA")

  if(req.body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const order_id = req.body.resource.supplementary_data.related_ids.order_id
    await Sale.findOneAndUpdate(
      { order_id },
      { webhookReceived: true, order_status: "COMPLETED" }
    );
  }


  await Notification.create({
    params: req.params,
    body: req.body,
    query: req.query,
  });
  
});

module.exports = router;
