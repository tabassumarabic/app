// Tabassum platformasi: fon xizmati — bildirishnomalarni qabul qiladi.
// Sahifalarni keshlamaydi (har doim saytning eng yangi versiyasi ochiladi).
self.addEventListener("install", function(){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener("push", function(e){
  var d = {};
  try { d = e.data.json(); } catch (x) { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Tabassum", {
    body: d.body || "", icon: "ikonka/ikonka-192.png", badge: "ikonka/ikonka-192.png",
    tag: d.tag || "tabassum", data: { url: d.url || "./" }
  }));
});

self.addEventListener("notificationclick", function(e){
  e.notification.close();
  var url = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(oynalar){
    for (var i = 0; i < oynalar.length; i++){
      var c = oynalar[i];
      if (c.url.indexOf(self.registration.scope) === 0 && "focus" in c){ c.navigate(url); return c.focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
