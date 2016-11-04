var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);
// var nodes = [];
// var edges = [];
var exits = false;
var network;

const ip = 'localhost';
const port = 1337;

$(document).ready(function () {

      var container = document.getElementById('graph');

      var options = {
        interaction:{hover:true},
        nodes : {
          shape: 'circle',
          size: 350,
          font: {
            color: 'black',
            size: 14, // px
            face: 'arial',
            background: 'none',
            strokeWidth: 0, // px
            strokeColor: '#ffffff',
            align: 'center'
          }
        },
        physics:{
          enabled: true,
          barnesHut: {
            gravitationalConstant: -15000,
            centralGravity: 0.2,
            springLength: 55,
            springConstant: 0.04,
            damping: 0.2,
            avoidOverlap: 0
          }
        }
      };

      var data = {
        nodes: nodes,
        edges: edges
      };
      network = new vis.Network(container, data, options);
      // network = new vis.Network(container, data, options);

      network.on("doubleClick", function (params) {
        // console.log(params.nodes.length);
        // console.log(params.nodes[0]);
        console.log(params);
        if (params.nodes.length == 1) {
          var enty = {};
          enty.id = params.nodes[0];
          enty.e = 1,
          enty.v = 1;
          getEntity(enty);
          exits = true;
        }
      });

      network.on("click", function (params) {
        if (params.nodes.length == 1) {
          nodes.update([{
            id: params.nodes[0],
            fixed: true
          }]);
        }
      });

      network.on("dragStart", function (params) {
        if (params.nodes.length == 1) {
          nodes.update([{
            id: params.nodes[0],
            fixed: false
          }]);
        }
      });

      network.on("dragEnd", function (params) {
        if (params.nodes.length == 1) {
          nodes.update([{
            id: params.nodes[0],
            fixed: true
          }]);
        }
      });

    //   network.on("hoverEdge", function (params) {
    //     console.log('hoverEdge Event:', params);
    // });

    // network.on("showPopup", function (params) {
    //     console.log('=^^=|_');
    // });

  var enty = {
    id: 'Neo'
  };
  // var enty = {
  //   id: 'Neo',
  //   e = 1,
  //   v = 1
  // };
  getEntity(enty);
});



function getEntity(enty) {
  // console.log(enty);
  $.post('http://' + ip + ':' + port + '/entity/read', enty, function (data) {
      console.log(data);
      parseNodes(data);
  }).fail(function () {
    console.error('algo fue mal :S');
  });
}

function getEntityEagerness0(id) {
  // console.log(enty);
  var enty = {
    id: id
  };
  $.post('http://' + ip + ':' + port + '/entity/read', enty, function (data) {
    updateAttributesNode(data);
  }).fail(function () {
    console.error('algo fue mal :S');
  });
}

function parseNodes(data) {
  if (data.relations) {
    for (var i = 0; i < data.relations.length; i++) {
      var node = {};
      var edge = {};
      edge.label = data.relations[i].relation;
      edge.font = {align: 'middle'};
      node.id = data.relations[i].target.idw;
      getEntityEagerness0(node.id);
      node.label = data.relations[i].target.idw;
      edge.id = data.relations[i].id;
      edge.from = data.idw;
      edge.to = data.relations[i].target.idw;
      edge.arrows = 'to';
      try {
        edges.add(edge);
      } catch (e) {}
      try {
        nodes.add(node);
      } catch (e) {
        nodes.remove({id:node.id});
      }
    }
  }
  updateAttributesNode(data);
}

function updateAttributesNode(data) {
  if (data.attributes && data.attributes.length != 0) {
    var attr = "";
    for (var i = 0; i < data.attributes.length; i++) {
      for (var key in data.attributes[i]) {
        attr += "<p>" + key + ': ' + data.attributes[i][key] + "</p>"
      }
    }
    node = {
      id: data.idw,
      label: data.idw,
      title: attr
    };
    if (nodes.length === 0) {
      nodes.add([node]);
    } else {
      nodes.update([node]);
    }
  }
}
