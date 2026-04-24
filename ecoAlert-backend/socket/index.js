module.exports = (io) => {
  const userSockets = new Map(); // userId → socketId

  io.on("connection", (socket) => {
    socket.on("join", ({ userId, role }) => {
      userSockets.set(userId, socket.id);
      socket.userId = userId;
      socket.userRole = role;
      if (role === "admin") socket.join("admins");
      if (role === "chauffeur") socket.join(`chauffeur_${userId}`);
    });

    /* Nouvelle alerte → broadcast admins + chauffeurs zone */
    socket.on("alerte:new", (data) => {
      io.to("admins").emit("alerte:received", data);
      if (data.zoneId) io.to(`zone_${data.zoneId}`).emit("alerte:received", data);
    });

    /* Chauffeur rejoint zone */
    socket.on("zone:join", ({ zoneId }) => socket.join(`zone_${zoneId}`));

    /* Position chauffeur temps réel */
    socket.on("chauffeur:position", (data) => {
      io.to("admins").emit("chauffeur:position", data);
    });

    /* Intervention update */
    socket.on("intervention:update", (data) => {
      io.to("admins").emit("intervention:update", data);
    });

    socket.on("disconnect", () => {
      if (socket.userId) userSockets.delete(socket.userId);
    });
  });

  /* Helper: envoyer notif à un user spécifique */
  io.sendToUser = (userId, event, data) => {
    const sid = userSockets.get(userId);
    if (sid) io.to(sid).emit(event, data);
  };
};
