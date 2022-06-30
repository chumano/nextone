(this.webpackJsonphtml = this.webpackJsonphtml || []).push([[0], {
            50: function (e, t, n) {
                e.exports = n(70)
            },
            55: function (e, t, n) {},
            68: function (e, t, n) {},
            69: function (e, t, n) {},
            70: function (e, t, n) {
                "use strict";
                n.r(t);
                var a,
                o,
                A,
                i,
                r = n(0),
                s = n.n(r),
                l = n(22),
                c = n.n(l),
                E = (n(55), n(27)),
                u = n(29),
                d = n(14),
                m = n(15),
                p = n(17),
                g = n(16),
                M = n(18),
                O = (n(56), n(57), n(58), n(59), n(44)),
                h = n.n(O),
                f = n(45),
                y = n.n(f),
                N = n(30),
                L = n(46),
                C = n(38),
                v = n(28),
                D = n(32),
                w = n(33),
                R = n(34);
                !function (e) {
                    e.MAP_COMPONENT_MOUNTED = "MAP_COMPONENT_MOUNTED",
                    e.MAP_READY = "MAP_READY",
                    e.DOCUMENT_EVENT_LISTENER_ADDED = "DOCUMENT_EVENT_LISTENER_ADDED",
                    e.WINDOW_EVENT_LISTENER_ADDED = "WINDOW_EVENT_LISTENER_ADDED",
                    e.UNABLE_TO_ADD_EVENT_LISTENER = "UNABLE_TO_ADD_EVENT_LISTENER",
                    e.DOCUMENT_EVENT_LISTENER_REMOVED = "DOCUMENT_EVENT_LISTENER_REMOVED",
                    e.WINDOW_EVENT_LISTENER_REMOVED = "WINDOW_EVENT_LISTENER_REMOVED",
                    e.ON_MOVE_END = "onMoveEnd",
                    e.ON_MOVE_START = "onMoveStart",
                    e.ON_MOVE = "onMove",
                    e.ON_RESIZE = "onResize",
                    e.ON_UNLOAD = "onUnload",
                    e.ON_VIEW_RESET = "onViewReset",
                    e.ON_ZOOM_END = "onZoomEnd",
                    e.ON_ZOOM_LEVELS_CHANGE = "onZoomLevelsChange",
                    e.ON_ZOOM_START = "onZoomStart",
                    e.ON_ZOOM = "onZoom",
                    e.ON_MAP_TOUCHED = "onMapClicked",
                    e.ON_MAP_MARKER_CLICKED = "onMapMarkerClicked"
                }
                (a || (a = {})),
                function (e) {
                    e.BOUNCE = "bounce",
                    e.FADE = "fade",
                    e.PULSE = "pulse",
                    e.JUMP = "jump",
                    e.SPIN = "spin",
                    e.WAGGLE = "waggle"
                }
                (o || (o = {})),
                function (e) {
                    e.IMAGE_LAYER = "ImageOverlay",
                    e.TILE_LAYER = "TileLayer",
                    e.VECTOR_LAYER = "VectorLayer",
                    e.VIDEO_LAYER = "VideoOverlay",
                    e.WMS_TILE_LAYER = "WMSTileLayer"
                }
                (A || (A = {})),
                function (e) {
                    e.CIRCLE = "Circle",
                    e.CIRCLE_MARKER = "CircleMarker",
                    e.POLYLINE = "Polyline",
                    e.POLYGON = "Polygon",
                    e.RECTANGLE = "Rectangle"
                }
                (i || (i = {}));
                var _,
                b = "infinite";
                !function (e) {
                    e.NORMAL = "nomal",
                    e.REVERSE = "reverse",
                    e.ALTERNATE = "alternate",
                    e.ALTERNATE_REVERSE = "alternate-reverse"
                }
                (_ || (_ = {}));
                var T = v.b.BaseLayer,
                I = function (e) {
                    function t() {
                        var e,
                        n,
                        a = this;
                        Object(d.a)(this, t);
                        for (var o = arguments.length, i = new Array(o), s = 0; s < o; s++)
                            i[s] = arguments[s];
                        return (n = Object(p.a)(this, (e = Object(g.a)(t)).call.apply(e, [this].concat(i)))).Layer = function (e) {
                            switch (e.layerType) {
                            case A.IMAGE_LAYER:
                                return r.createElement(D.a, e);
                            case A.WMS_TILE_LAYER:
                                return r.createElement(w.a, e);
                            default:
                                return r.createElement(R.a, e)
                            }
                        },
                        n.Layers = function () {
                            var e = n.props.mapLayers;
                            return e.map(function (t, n) {
                                var o;
                                return t.baseLayerName && e.length > 1 ? r.createElement(T, {
                                    key: "layer-".concat(n),
                                    checked: null !== (o = t.baseLayerIsChecked) && void 0 !== o && o,
                                    name: t.baseLayerName || "Layer.".concat(n)
                                }, r.createElement(a.Layer, t)) : r.createElement(a.Layer, Object.assign({
                                        key: "layer-".concat(n)
                                    }, t))
                            })
                        },
                        n
                    }
                    return Object(M.a)(t, e),
                    Object(m.a)(t, [{
                                key: "render",
                                value: function () {
                                    return this.props.mapLayers.length > 1 ? r.createElement(v.b, null, this.Layers()) : r.createElement(r.Fragment, null, this.Layers())
                                }
                            }
                        ]),
                    t
                }
                (r.Component),
                S = n(39),
                P = n(42),
                k = n(37),
                G = n(49),
                U = n.n(G),
                j = n(2),
                B = n.n(j),
                V = function (e) {
                    return B.a.divIcon({
                        className: "clearMarkerContainer",
                        html: e.animation ? x(e.icon || "📍", e.animation || null, e.size || [24, 24]) : J(e.icon, e.size),
                        iconAnchor: e.iconAnchor || null
                    })
                },
                x = function (e, t) {
                    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [24, 24];
                    return "<div class='animationContainer' style=\"\nanimation-name: ".concat(t.type ? t.type : "bounce", ";\nanimation-duration: ").concat(t.duration ? t.duration : 1, "s ;\nanimation-delay: ").concat(t.delay ? t.delay : 0, "s;\nanimation-direction: ").concat(t.direction ? t.direction : "normal", ";\nanimation-iteration-count: ").concat(t.iterationCount ? t.iterationCount : "infinite", '">\n').concat(W(e, n), "\n</div>")
                },
                J = function (e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [24, 24];
                    return "<div class='unanimatedIconContainer'>".concat(W(e, t), "</div>")
                },
                W = function (e, t) {
                    return e.includes("svg") || e.includes("SVG") ? " <div style='font-size: ".concat(Math.max(t[0], t[1]), "px'>\n").concat(e, "\n</div>") : e.includes("//") && e.includes("http") ? '<img src="'.concat(e, '" style="width:').concat(t[0], "px;height:").concat(t[1], 'px;">') : e.includes("base64") ? '<img src="'.concat("data:image/gif;base64,R0lGODlhPQBEAPeoAJosM//AwO/AwHVYZ/z595kzAP/s7P+goOXMv8+fhw/v739/f+8PD98fH/8mJl+fn/9ZWb8/PzWlwv///6wWGbImAPgTEMImIN9gUFCEm/gDALULDN8PAD6atYdCTX9gUNKlj8wZAKUsAOzZz+UMAOsJAP/Z2ccMDA8PD/95eX5NWvsJCOVNQPtfX/8zM8+QePLl38MGBr8JCP+zs9myn/8GBqwpAP/GxgwJCPny78lzYLgjAJ8vAP9fX/+MjMUcAN8zM/9wcM8ZGcATEL+QePdZWf/29uc/P9cmJu9MTDImIN+/r7+/vz8/P8VNQGNugV8AAF9fX8swMNgTAFlDOICAgPNSUnNWSMQ5MBAQEJE3QPIGAM9AQMqGcG9vb6MhJsEdGM8vLx8fH98AANIWAMuQeL8fABkTEPPQ0OM5OSYdGFl5jo+Pj/+pqcsTE78wMFNGQLYmID4dGPvd3UBAQJmTkP+8vH9QUK+vr8ZWSHpzcJMmILdwcLOGcHRQUHxwcK9PT9DQ0O/v70w5MLypoG8wKOuwsP/g4P/Q0IcwKEswKMl8aJ9fX2xjdOtGRs/Pz+Dg4GImIP8gIH0sKEAwKKmTiKZ8aB/f39Wsl+LFt8dgUE9PT5x5aHBwcP+AgP+WltdgYMyZfyywz78AAAAAAAD///8AAP9mZv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAKgALAAAAAA9AEQAAAj/AFEJHEiwoMGDCBMqXMiwocAbBww4nEhxoYkUpzJGrMixogkfGUNqlNixJEIDB0SqHGmyJSojM1bKZOmyop0gM3Oe2liTISKMOoPy7GnwY9CjIYcSRYm0aVKSLmE6nfq05QycVLPuhDrxBlCtYJUqNAq2bNWEBj6ZXRuyxZyDRtqwnXvkhACDV+euTeJm1Ki7A73qNWtFiF+/gA95Gly2CJLDhwEHMOUAAuOpLYDEgBxZ4GRTlC1fDnpkM+fOqD6DDj1aZpITp0dtGCDhr+fVuCu3zlg49ijaokTZTo27uG7Gjn2P+hI8+PDPERoUB318bWbfAJ5sUNFcuGRTYUqV/3ogfXp1rWlMc6awJjiAAd2fm4ogXjz56aypOoIde4OE5u/F9x199dlXnnGiHZWEYbGpsAEA3QXYnHwEFliKAgswgJ8LPeiUXGwedCAKABACCN+EA1pYIIYaFlcDhytd51sGAJbo3onOpajiihlO92KHGaUXGwWjUBChjSPiWJuOO/LYIm4v1tXfE6J4gCSJEZ7YgRYUNrkji9P55sF/ogxw5ZkSqIDaZBV6aSGYq/lGZplndkckZ98xoICbTcIJGQAZcNmdmUc210hs35nCyJ58fgmIKX5RQGOZowxaZwYA+JaoKQwswGijBV4C6SiTUmpphMspJx9unX4KaimjDv9aaXOEBteBqmuuxgEHoLX6Kqx+yXqqBANsgCtit4FWQAEkrNbpq7HSOmtwag5w57GrmlJBASEU18ADjUYb3ADTinIttsgSB1oJFfA63bduimuqKB1keqwUhoCSK374wbujvOSu4QG6UvxBRydcpKsav++Ca6G8A6Pr1x2kVMyHwsVxUALDq/krnrhPSOzXG1lUTIoffqGR7Goi2MAxbv6O2kEG56I7CSlRsEFKFVyovDJoIRTg7sugNRDGqCJzJgcKE0ywc0ELm6KBCCJo8DIPFeCWNGcyqNFE06ToAfV0HBRgxsvLThHn1oddQMrXj5DyAQgjEHSAJMWZwS3HPxT/QMbabI/iBCliMLEJKX2EEkomBAUCxRi42VDADxyTYDVogV+wSChqmKxEKCDAYFDFj4OmwbY7bDGdBhtrnTQYOigeChUmc1K3QTnAUfEgGFgAWt88hKA6aCRIXhxnQ1yg3BCayK44EWdkUQcBByEQChFXfCB776aQsG0BIlQgQgE8qO26X1h8cEUep8ngRBnOy74E9QgRgEAC8SvOfQkh7FDBDmS43PmGoIiKUUEGkMEC/PJHgxw0xH74yx/3XnaYRJgMB8obxQW6kL9QYEJ0FIFgByfIL7/IQAlvQwEpnAC7DtLNJCKUoO/w45c44GwCXiAFB/OXAATQryUxdN4LfFiwgjCNYg+kYMIEFkCKDs6PKAIJouyGWMS1FSKJOMRB/BoIxYJIUXFUxNwoIkEKPAgCBZSQHQ1A2EWDfDEUVLyADj5AChSIQW6gu10bE/JG2VnCZGfo4R4d0sdQoBAHhPjhIB94v/wRoRKQWGRHgrhGSQJxCS+0pCZbEhAAOw==", '" style="width:').concat(t[0], "px;height:").concat(t[1], 'px;">') : "<div style='font-size: ".concat(Math.max(t[0], t[1]), "px'>").concat(e, "</div>")
                };
                n(67);
                var Y = function (e) {
                    function t() {
                        var e,
                        n;
                        Object(d.a)(this, t);
                        for (var o = arguments.length, A = new Array(o), i = 0; i < o; i++)
                            A[i] = arguments[i];
                        return (n = Object(p.a)(this, (e = Object(g.a)(t)).call.apply(e, [this].concat(A)))).MapMarker = function (e) {
                            var t = e.mapMarker;
                            return r.createElement(S.a, {
                                key: t.id || Math.random().toString(),
                                position: t.position,
                                icon: V(t),
                                onClick: function () {
                                    n.props.onMapEvent(a.ON_MAP_MARKER_CLICKED, {
                                        mapMarkerID: t.id
                                    })
                                }
                            }, t.title && r.createElement(P.a, null, t.title))
                        },
                        n
                    }
                    return Object(M.a)(t, e),
                    Object(m.a)(t, [{
                                key: "render",
                                value: function () {
                                    var e = this,
                                    t = this.props,
                                    n = t.mapMarkers,
                                    a = t.useMarkerClustering;
                                    return void 0 === a || a ? r.createElement(k.a, null, r.createElement(U.a, null, n.map(function (t) {
                                                return "OWN_POSTION_MARKER_ID" !== t.id ? r.createElement(e.MapMarker, {
                                                    key: t.id || Math.random().toString(),
                                                    mapMarker: t
                                                }) : null
                                            })), n.map(function (t) {
                                            return "OWN_POSTION_MARKER_ID" === t.id ? r.createElement(e.MapMarker, {
                                                mapMarker: t
                                            }) : null
                                        })) : r.createElement(k.a, null, n.map(function (t) {
                                            return r.createElement(e.MapMarker, {
                                                mapMarker: t
                                            })
                                        }))
                                }
                            }
                        ]),
                    t
                }
                (r.Component),
                K = n(35),
                Z = n(36),
                Q = n(40),
                z = n(41),
                F = n(43),
                H = function (e) {
                    function t() {
                        var e,
                        n;
                        Object(d.a)(this, t);
                        for (var a = arguments.length, o = new Array(a), A = 0; A < a; A++)
                            o[A] = arguments[A];
                        return (n = Object(p.a)(this, (e = Object(g.a)(t)).call.apply(e, [this].concat(o)))).Shape = function (e) {
                            switch (e.shapeType) {
                            case i.CIRCLE:
                                return r.createElement(K.a, e);
                            case i.CIRCLE_MARKER:
                                return r.createElement(Z.a, e);
                            case i.POLYGON:
                                return r.createElement(Q.a, e);
                            case i.POLYLINE:
                                return r.createElement(z.a, e);
                            case i.RECTANGLE:
                                return r.createElement(F.a, e);
                            default:
                                return console.warn("Unknown map shape type", e.shapeType),
                                null
                            }
                        },
                        n
                    }
                    return Object(M.a)(t, e),
                    Object(m.a)(t, [{
                                key: "render",
                                value: function () {
                                    var e = this;
                                    return r.createElement(r.Fragment, null, this.props.mapShapes.map(function (t) {
                                            var n,
                                            a = Object(E.a)({}, t, {
                                                color: null !== (n = t.color) && void 0 !== n ? n : "white"
                                            });
                                            return r.createElement(e.Shape, Object.assign({}, a, {
                                                    key: Math.random().toString()
                                                }))
                                        }))
                                }
                            }
                        ]),
                    t
                }
                (r.Component),
                X = function (e) {
                    e.addDebugMessage;
                    var t = e.debugMessages,
                    n = e.mapCenterPosition,
                    o = e.mapLayers,
                    A = void 0 === o ? [] : o,
                    i = e.mapMarkers,
                    s = void 0 === i ? [] : i,
                    l = e.mapShapes,
                    c = void 0 === l ? [] : l,
                    E = e.onMapEvent,
                    u = e.ownPositionMarker,
                    d = e.setMapRef,
                    m = e.zoom,
                    p = void 0 === m ? 13 : m,
                    g = Object(r.useState)({
                        height: 0,
                        width: 0
                    }),
                    M = Object(N.a)(g, 2),
                    O = M[0],
                    h = M[1],
                    f = Object(r.useState)([]),
                    y = Object(N.a)(f, 2),
                    v = y[0],
                    D = y[1];
                    return Object(r.useEffect)(function () {
                        var e = s;
                        u && e.push(u),
                        D(e)
                    }, [s, u]),
                    r.createElement(r.Fragment, null, r.createElement(L.a, {
                            bounds: !0,
                            onResize: function (e) {
                                var t = e.bounds,
                                n = t.height,
                                a = t.width;
                                h({
                                    height: n,
                                    width: a
                                })
                            }
                        }, function (e) {
                            var t = e.measureRef;
                            return r.createElement("div", {
                                ref: t,
                                id: "map-container",
                                style: {
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    backgroundColor: "greenyellow",
                                    left: 0,
                                    right: 0
                                }
                            }, O.height > 0 && r.createElement(C.a, {
                                    ref: function (e) {
                                        d(e)
                                    },
                                    center: n,
                                    onClick: function (e) {
                                        var t = e.containerPoint,
                                        n = e.layerPoint,
                                        o = e.latlng;
                                        E(a.ON_MAP_TOUCHED, {
                                            containerPoint: t,
                                            layerPoint: n,
                                            touchLatLng: o
                                        })
                                    },
                                    onZoomLevelsChange: function () {
                                        E(a.ON_ZOOM_LEVELS_CHANGE)
                                    },
                                    onResize: function () {
                                        E(a.ON_RESIZE)
                                    },
                                    onZoomStart: function () {
                                        E(a.ON_ZOOM_START)
                                    },
                                    onMoveStart: function () {
                                        E(a.ON_MOVE_START)
                                    },
                                    onZoom: function () {
                                        E(a.ON_ZOOM)
                                    },
                                    onMove: function () {
                                        E(a.ON_MOVE)
                                    },
                                    onZoomEnd: function () {
                                        E(a.ON_ZOOM_END)
                                    },
                                    onMoveEnd: function () {
                                        E(a.ON_MOVE_END)
                                    },
                                    onUnload: function () {
                                        E(a.ON_UNLOAD)
                                    },
                                    onViewReset: function () {
                                        E(a.ON_VIEW_RESET)
                                    },
                                    maxZoom: 17,
                                    zoom: p,
                                    style: {
                                        width: "100%",
                                        height: O.height
                                    }
                                }, r.createElement(I, {
                                        mapLayers: A
                                    }), r.createElement(Y, {
                                        mapMarkers: v,
                                        onMapEvent: E
                                    }), r.createElement(H, {
                                        mapShapes: c,
                                        onMapEvent: E
                                    })))
                        }), se ? r.createElement("div", {
                            style: {
                                backgroundColor: "orange",
                                maxHeight: "200px",
                                overflow: "auto",
                                padding: 5,
                                position: "fixed",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                zIndex: 15e3
                            },
                            id: "messages"
                        }, r.createElement("ul", null, t.map(function (e, t) {
                                    return r.createElement("li", {
                                        key: t
                                    }, e)
                                }))) : null)
                },
                q = [{
                        attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                        baseLayerIsChecked: !0,
                        baseLayerName: "OpenStreetMap.Mapnik",
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }, {
                        attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                        baseLayerIsChecked: !1,
                        baseLayerName: "OpenStreetMap.BlackAndWhite",
                        url: "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                    }, {
                        baseLayerName: "WMS Tile Layer",
                        subLayer: "nasa:bluemarble",
                        layerType: A.WMS_TILE_LAYER,
                        url: "https://demo.boundlessgeo.com/geoserver/ows"
                    }, {
                        baseLayerName: "Image",
                        layerType: A.IMAGE_LAYER,
                        url: "http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg",
                        bounds: [[40.712216, -74.22655], [40.773941, -74.12544]]
                    }
                ],
                $ = {
                    shapeType: i.CIRCLE,
                    color: "#123123",
                    id: "1",
                    center: {
                        lat: 34.225727,
                        lng: -77.94471
                    },
                    radius: 2e3
                },
                ee = {
                    shapeType: i.CIRCLE_MARKER,
                    color: "red",
                    id: "2",
                    center: {
                        lat: 38.437424,
                        lng: -78.867912
                    },
                    radius: 15
                },
                te = {
                    shapeType: i.POLYGON,
                    color: "blue",
                    id: "3",
                    positions: [{
                            lat: 38.80118939192329,
                            lng: -74.69604492187501
                        }, {
                            lat: 38.19502155795575,
                            lng: -74.65209960937501
                        }, {
                            lat: 39.07890809706475,
                            lng: -71.46606445312501
                        }
                    ]
                },
                ne = (i.POLYGON, {
                    shapeType: i.POLYLINE,
                    color: "orange",
                    id: "5",
                    positions: [{
                            lat: 35.411438052435486,
                            lng: -78.67858886718751
                        }, {
                            lat: 35.9602229692967,
                            lng: -79.18945312500001
                        }, {
                            lat: 35.97356075349624,
                            lng: -78.30505371093751
                        }
                    ]
                }),
                ae = (i.POLYLINE, [$, ee, te, ne, {
                            shapeType: i.RECTANGLE,
                            color: "yellow",
                            id: "6",
                            bounds: [{
                                    lat: 36.5,
                                    lng: -75.7
                                }, {
                                    lat: 38.01,
                                    lng: -73.13
                                }
                            ]
                        }
                    ]),
                oe = ["😴", "😄", "😃", "⛔", "🎠", "🚓", "🚇"],
                Ae = Math.floor(3 * Math.random()) + 1,
                ie = .5 * Math.floor(Math.random()),
                re = [{
                        id: "2",
                        position: {
                            lat: 37.06452161,
                            lng: -75.67364786
                        },
                        icon: "😴",
                        size: [64, 64],
                        animation: {
                            duration: Ae,
                            delay: ie,
                            iterationCount: "infinite",
                            type: o.PULSE
                        }
                    }, {
                        id: "19",
                        position: {
                            lat: 36.46410354,
                            lng: -75.6432701
                        },
                        icon: "https://www.catster.com/wp-content/uploads/2018/07/Savannah-cat-long-body-shot.jpg",
                        size: [32, 32],
                        animation: {
                            duration: Ae,
                            delay: ie,
                            iterationCount: "infinite",
                            type: o.BOUNCE
                        }
                    }, {
                        id: "100",
                        position: new j.LatLng(37.23310632, -76.23518332),
                        icon: oe[Math.floor(Math.random() * oe.length)],
                        animation: {
                            duration: Ae,
                            delay: ie,
                            iterationCount: "infinite",
                            type: o.WAGGLE
                        }
                    }, {
                        id: "1",
                        position: {
                            lat: 36.46410354,
                            lng: -75.6432701
                        },
                        icon: "😴",
                        size: [32, 32],
                        animation: {
                            type: o.SPIN,
                            duration: Ae,
                            delay: ie,
                            iterationCount: "infinite"
                        }
                    }, {
                        id: "1000",
                        position: new j.LatLng(36.60061515, -76.48888338),
                        icon: '<svg xmlns="http://www.w3.org/2000/svg">\n    <circle id="greencircle" cx="30" cy="30" r="30" fill="green" />\n</svg>',
                        animation: {
                            duration: Ae,
                            delay: ie,
                            iterationCount: "infinite",
                            type: o.PULSE
                        }
                    }, {
                        id: Math.floor(1e3 * Math.random()).toString(),
                        position: {
                            lat: 37.0580835,
                            lng: -75.82318747
                        },
                        icon: "Fish",
                        animation: {
                            type: o.WAGGLE,
                            duration: Ae,
                            delay: ie,
                            iterationCount: "infinite"
                        }
                    }, {
                        id: Math.floor(1e3 * Math.random()).toString(),
                        position: {
                            lat: 37.23310632,
                            lng: -76.23518332
                        },
                        icon: oe[Math.floor(Math.random() * oe.length)],
                        size: [4, 4],
                        animation: {
                            type: o.PULSE,
                            duration: Ae,
                            delay: ie,
                            iterationCount: "infinite"
                        }
                    }
                ],
                se = (n(68), n(69), !1),
                le = !1,
                ce = function (e) {
                    function t(e) {
                        var n;
                        return Object(d.a)(this, t),
                        (n = Object(p.a)(this, Object(g.a)(t).call(this, e))).componentDidMount = function () {
                            var e = B.a.icon({
                                iconUrl: h.a,
                                shadowUrl: y.a
                            });
                            B.a.Marker.prototype.options.icon = e,
                            n.addEventListeners(),
                            n.sendMessage({
                                msg: a.MAP_COMPONENT_MOUNTED
                            }),
                            le && n.loadMockData()
                        },
                        n.componentDidUpdate = function (e, t) {
                            var o,
                            A = n.state.mapRef;
                            A && !t.mapRef && (null === (o = A.current) || void 0 === o || o.leafletElement.invalidateSize(), n.sendMessage({
                                    msg: a.MAP_READY
                                }))
                        },
                        n.addDebugMessage = function (e) {
                            "object" == typeof e ? (n.addDebugMessage("STRINGIFIED"), n.setState({
                                    debugMessages: [].concat(Object(u.a)(n.state.debugMessages), [JSON.stringify(e, null, 4)])
                                })) : n.setState({
                                debugMessages: [].concat(Object(u.a)(n.state.debugMessages), [e])
                            })
                        },
                        n.addEventListeners = function () {
                            document && (document.addEventListener("message", n.handleMessage), n.addDebugMessage("set document listeners"), n.sendMessage({
                                    msg: a.DOCUMENT_EVENT_LISTENER_ADDED
                                })),
                            window && (window.addEventListener("message", n.handleMessage), n.addDebugMessage("setting Window"), n.sendMessage({
                                    msg: a.WINDOW_EVENT_LISTENER_ADDED
                                })),
                            document || window || n.sendMessage({
                                error: a.UNABLE_TO_ADD_EVENT_LISTENER
                            })
                        },
                        n.handleMessage = function (e) {
                            n.addDebugMessage(e.data);
                            try {
                                e.data.mapCenterPosition && n.state.mapRef.leafletElement.flyTo([e.data.mapCenterPosition.lat, e.data.mapCenterPosition.lng]),
                                n.setState(Object(E.a)({}, n.state, {}, e.data))
                            } catch (e) {
                                n.addDebugMessage({
                                    error: JSON.stringify(e)
                                })
                            }
                        },
                        n.sendMessage = function (e) {
                            window.ReactNativeWebView && (window.ReactNativeWebView.postMessage(JSON.stringify(e)), console.log("sendMessage  ", JSON.stringify(e)))
                        },
                        n.loadMockData = function () {
                            n.addDebugMessage("loading mock data"),
                            n.setState({
                                mapLayers: q,
                                mapMarkers: re,
                                mapShapes: ae,
                                ownPositionMarker: {
                                    id: "Own Position",
                                    position: {
                                        lat: 36.56,
                                        lng: -76.17
                                    },
                                    icon: "❤️",
                                    size: [32, 32],
                                    animation: {
                                        duration: 1,
                                        delay: 0,
                                        iterationCount: b,
                                        type: o.BOUNCE
                                    }
                                }
                            })
                        },
                        n.onMapEvent = function (e, t) {
                            var a,
                            o,
                            A,
                            i,
                            r;
                            !t && (null === (a = n.state.mapRef) || void 0 === a ? void 0 : a.leafletElement) && (t = {
                                    mapCenterPosition: {
                                        lat: null === (o = n.state.mapRef.leafletElement) || void 0 === o ? void 0 : o.getCenter().lat,
                                        lng: null === (A = n.state.mapRef.leafletElement) || void 0 === A ? void 0 : A.getCenter().lng
                                    },
                                    bounds: null === (i = n.state.mapRef.leafletElement) || void 0 === i ? void 0 : i.getBounds(),
                                    zoom: null === (r = n.state.mapRef.leafletElement) || void 0 === r ? void 0 : r.getZoom()
                                }),
                            n.sendMessage({
                                event: e,
                                payload: t
                            })
                        },
                        n.setMapRef = function (e) {
                            n.state.mapRef || n.setState({
                                mapRef: e
                            })
                        },
                        n.state = {
                            debugMessages: ["test"],
                            isFromNative: !1,
                            isMobile: null,
                            mapCenterPosition: {
                                lat: 36.56,
                                lng: -76.17
                            },
                            mapLayers: [],
                            mapMarkers: [],
                            mapShapes: [],
                            mapRef: null,
                            ownPositionMarker: null,
                            updatedCenterPosition: null,
                            zoom: 6
                        },
                        n
                    }
                    return Object(M.a)(t, e),
                    Object(m.a)(t, [{
                                key: "render",
                                value: function () {
                                    var e = this.state,
                                    t = e.debugMessages,
                                    n = e.mapCenterPosition,
                                    a = e.mapLayers,
                                    o = e.mapMarkers,
                                    A = e.mapShapes,
                                    i = e.ownPositionMarker,
                                    r = e.zoom;
                                    return s.a.createElement(X, {
                                        addDebugMessage: this.addDebugMessage,
                                        debugMessages: t,
                                        mapCenterPosition: n,
                                        mapLayers: a,
                                        mapMarkers: o,
                                        mapShapes: A,
                                        onMapEvent: this.onMapEvent,
                                        ownPositionMarker: i,
                                        setMapRef: this.setMapRef,
                                        zoom: r
                                    })
                                }
                            }
                        ]),
                    t
                }
                (r.Component);
                Boolean("localhost" === window.location.hostname || "[::1]" === window.location.hostname || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)),
                c.a.render(s.a.createElement(ce, null), document.getElementById("root")),
                "serviceWorker" in navigator && navigator.serviceWorker.ready.then(function (e) {
                    e.unregister()
                })
            }
        }, [[50, 1, 2]]]);
