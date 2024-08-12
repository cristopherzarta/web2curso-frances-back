const express = require("express");
const router = express.Router();
const passport = require("passport");
const Sale = require("../models/sales");
const {
  createOrder,
  capturePayment,
  refundPayment,
} = require("../helpers/paypal");
const Notification = require("../models/notification");

//obtener las curso

router.post("/orders", passport.authenticate("jwt"), async (req, res) => {
  const { price, courseId } = req.body;
  const order = await createOrder(price);
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
  //console.log({ payments: captureData.payment_source.paypal})
  const capture_id = captureData.purchase_units[0].payments.captures[0].id;
  await Sale.findOneAndUpdate(
    { order_id: orderID },
    {
      order_status: "COMPLETED",
      capture_id,
      payer: captureData.payer,
    }
  );
  //SKJSKLAJDJKLSJLKJDSKLJDSLSKDLJSDKL
  res.json(capture_id);
});

router.post(
  "/captures/:captureID/refund",
  passport.authenticate("jwt"),
  async (req, res) => {
    const { captureID } = req.params;
    console.log({ captureID });
    try {
      await refundPayment(captureID);
      /*console.log({ refundData });*/
      await Sale.findOneAndUpdate(
        { capture_id: captureID },
        {
          order_status: "REFUNDED",
        }
      );
      //SKJSKLAJDJKLSJLKJDSKLJDSLSKDLJSDKL
      res.json({
        ok: true,
        message:
          "Pago devuelto con éxito! Lamento que el curso no haya cumplido tus expectativas 😢",
      });
    } catch (err) {
      res.status({
        ok: false,
        message:
          "Hubo un error al devolver tu pago, por favor intenta mas tarde",
      });
    }
  }
);

router.post("/webhook", async (req, res) => {
  res.status(200).send();

  console.log("NOTIFICATION RECIBIDA");

  if (req.body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const resource = req.body.resource;
    const order_id = resource.supplementary_data.related_ids.order_id;
    await Sale.findOneAndUpdate(
      { order_id },
      {
        webhookReceived: true,
        order_status: "COMPLETED",
        paypal_links: resource.links,
      }
    );
  }

  await Notification.create({
    params: req.params,
    body: req.body,
    query: req.query,
  });
});

module.exports = router;
