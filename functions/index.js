const functions = require("firebase-functions");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);


const app = express();
// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse json data
app.use(bodyParser.json());

app.post("/users/add/", (request, response) => {
  const db = admin.firestore();
  db.collection("users").add(request.body).then(
      (docRef) => {
        response.send({
          message: "Document created",
        }
        );
        return "";
      }

  ).catch((error) => {
    response.send({
      error: error.message,
      message: "Failed to add User to collection",
    });
  });
});


app.post("/users/update/:email", (request, response) => {
  const db = admin.firestore();
  console.log("Updating User => ", request.params.email);
  db.collection("users")
      .where("email", "==", request.params.email).get().then(
          (snapshot)=>{
            snapshot.docs.forEach((doc) => {
              console.log("Updating doc : =>", doc.id);
              db.collection("users").doc(doc.id).update(
                  request.body
              )
                  .then((snapshot) => {
                    return "";
                  }).catch((reason) => {
                    response.send(reason);
                  });
            }
            );
            response.send({
              message: "Completed updating",
              changed: snapshot.docs,
              requested: request.body,
              email: request.params.email,
            });
          }) .catch((error) => {
        response.send({
          error: error.message,
          message: "Failed to add User to collection",
        });
      });
});


app.get("/users", (request, response) => {
  let stuff = [];
  const db = admin.firestore();
  db.collection("users").get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const newelement = {
            "id": doc.id,
            "data": doc.data(),
          };
          console.log(newelement);
          stuff = stuff.concat(newelement);
        });
        console.log(stuff);
        response.send(stuff);
        return "";
      }).catch((reason) => {
        response.send(reason);
      });
});

app.post("/serviceproviders", (request, response) => {
  const db = admin.firestore();
  const serviceProvider = request.body;
  db.collection("service_providers").add(serviceProvider).then(
      (docRef) => {
        response.send({
          message: "Appointment created",
        }
        );
        return "";
      }
  ).catch((error) => {
    response.send({
      error: error.message,
      message: "Failed to add serviceproviders  to collection of Appointment",
    });
  });
});

app.get("/serviceproviders", (request, response) => {
  let stuff = [];
  const db = admin.firestore();
  db.collection("service_providers").get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const newelement = {
            "id": doc.id,
            "data": doc.data(),
          };
          console.log(newelement);
          stuff = stuff.concat(newelement);
        });
        console.log(stuff);
        response.send(stuff);
        return "";
      }).catch((reason) => {
        response.send(reason);
      });
});
app.get("/serviceprovider/:id", (request, response) => {
  const db = admin.firestore();
  db.doc("service_providers/" + request.params.id).get().then((snapshot) => {
    const newelement = {
      "id": snapshot.id,
      "data": snapshot.data(),
    };
    response.send(newelement);
    return "";
  }).catch((reason) => {
    response.send(reason);
  });
});

app.get("/appointments", (request, response) => {
  let stuff = [];
  const db = admin.firestore();
  db.collection("appointments").get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const newelement = {
            "id": doc.id,
            "data": doc.data(),
          };
          console.log(newelement);
          stuff = stuff.concat(newelement);
        });
        console.log(stuff);
        response.send(stuff);
        return "";
      }).catch((reason) => {
        response.send(reason);
      });
});

app.post("/appointments", (request, response) => {
  const db = admin.firestore();
  const appointment = request.body;
  db.collection("appointments").add(appointment).then(
      (docRef) => {
        response.send({
          message: "Appointment created",
        }

        );
        return "";
      }
  ).catch((error) => {
    response.send({
      error: error.message,
      message: "Failed to add Appointment  to collection of Appointment",
    });
  });
});

app.get("/appointments/details/:id", (request, response) => {
  const db = admin.firestore();
  db.doc("appointments/" + request.params.id).get().then((snapshot) => {
    const newelement = {
      "id": snapshot.id,
      "data": snapshot.data(),
    };
    response.send(newelement);
    return "";
  }).catch((reason) => {
    response.send(reason);
  });
});

app.put("/appointments/details/:id", (request, response) => {
  const db = admin.firestore();
  db.collection("appointments").doc(request.params.id).update(
      request.body
  )
      .then((snapshot) => {
        const newelement = {
          "id": snapshot.id,
          "data": snapshot.data(),
        };
        response.send(newelement);
        return "";
      }).catch((reason) => {
        response.send(reason);
      });
});

app.get("/appointments/:userId/:status/", (request, response) => {
  let stuff = [];
  const db = admin.firestore();
  db.collection("appointments")
      .where("userId", "==", request.params.userId)
      .where("status", "==", request.params.status)
      .get().then((snapshot) => {
        snapshot.forEach((doc) => {
          const newelement = {
            "id": doc.id,
            "data": doc.data(),
          };
          stuff = stuff.concat(newelement);
        });
        response.send(stuff);
        return "";
      }).catch((reason) => {
        response.send(reason);
      });
});

app.get("/appointments/:serviceProvider/", (request, response) => {
  let stuff = [];
  const db = admin.firestore();
  db.collection("appointments")
      .where("serviceProvider", "==", request.params.serviceProvider)
      .get().then((snapshot) => {
        snapshot.forEach((doc) => {
          const newelement = {
            "id": doc.id,
            "data": doc.data(),
          };
          stuff = stuff.concat(newelement);
        });
        response.send(stuff);
        return "";
      }).catch((reason) => {
        response.send(reason);
      });
});


// app.get("/transactions/", (request, response) => {
//   let stuff = [];
//   const db = admin.firestore();
//   db.collection("appointments")
//       .where("status", "==", "Completed")
//       .get().then((snapshot) => {
//         snapshot.forEach((doc) => {
//           const newelement = {
//             "id": doc.id,
//             "data": doc.data(),
//           };
//           stuff = stuff.concat(newelement);
//         });
//         response.send(stuff);
//         return "";
//       }).catch((reason) => {
//         response.send(reason);
//       });
// });

app.get("/messages/:email", (request, response)=> {
  const db = admin.firestore();
  db.collection("messages")
      .where("from.email", "==", request.params.email).get().then(
          (snapshot)=>{
            console.log("====> From Mesages", snapshot.docs.length );
            db.collection("messages")
                .where("to.email", "==", request.params.email).get().then(
                    (snapshot2)=>{
                      console.log("====> To Messages", snapshot2.docs.length );
                      const messages = snapshot.docs.concat(snapshot2.docs)
                          .map((doc)=>doc.data());
                      return response.send(messages);
                    }
                ).catch((reason) => {
                  response.send(reason);
                });
          }
      ).catch((reason) => {
        response.send(reason);
      });
});

app.post("/messages", (request, response)=> {
  const db = admin.firestore();
  request.body.createdAt =Date.now();
  request.body.to = {
    email: request.body.emailTo,
    name: request.body.nameTo,
  };
  request.body.from = {
    email: request.body.emailFrom,
    name: request.body.nameFrom,
  };
  delete request.body.emailFrom,
  delete request.body.nameFrom,
  delete request.body.emailTo,
  delete request.body.nameTo,

  db.collection("messages").add(request.body).then(
      (docRef) => {
        response.send({
          message: "Document created",
        }
        );
        return "";
      }

  ).catch((error) => {
    response.send({
      error: error.message,
      message: "Failed to add User to collection",
    });
  });
});

app.get("/chat/:email/:email2", (request, response)=> {
  const db = admin.firestore();
  db.collection("messages")
      .where("from.email", "==", request.params.email)
      .where("to.email", "==", request.params.email2)
      .orderBy("createdAt", "desc").get().then(
          (snapshot)=>{
            console.log("====> From Mesages", snapshot.docs.length );
            db.collection("messages")
                .where("to.email", "==", request.params.email)
                .where("from.email", "==", request.params.email2)
                .orderBy("createdAt", "desc").get().then(
                    (snapshot2)=>{
                      console.log("====> To Messages", snapshot2.docs.length );
                      const messages = snapshot.docs.concat(snapshot2.docs)
                          .map((doc)=>doc.data());
                      return response.send(messages);
                    }
                ).catch((reason) => {
                  response.send(reason);
                });
          }
      ).catch((reason) => {
        response.send(reason);
      });
});

exports.api = functions.https.onRequest(app);
