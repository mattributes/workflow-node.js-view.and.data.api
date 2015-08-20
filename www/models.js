var Model = React.createClass({
  onClick: function() {
    app.loadDocument(this.props.urn);
  },

  render: function() {
    var src =  'https://developer-stg.api.autodesk.com' + '/viewingservice/v1/thumbnails/' + this.props.urn + '?width=130&height=130';
    var classname = 'model';
    if (app.getCurrentDocumentUrn() === this.props.urn) {
      classname += ' model_selected';
    }
    return (
      <image className={classname} onClick={this.onClick} urn={this.props.urn} src={src}/>
      );
  }
});

var Models = React.createClass({
  render: function() {
    return (<div>
        {this.props.models.map(function(model, idx) {
          return (<Model urn={model} key={'modelIdx'+idx}/>);
        }, this)}
      </div>);
  }
});

var generateModelsDom = function(models) {
  var modelDiv = document.getElementById('modelBrowser');
  React.render(
    <Models models = {models} />,
    modelDiv
  );
}

generateModelsDom([
  'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTIwLTE2LTQ2LTA1LXR1dnI2cGVzZjd3YWtncG13dXF0aHZ3dXEzc3IvcGxhdGUyMHgyMHgyLTUuU1RM',
  'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs',
  // 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs',
  // 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs',
  // 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE1LTA4LTE5LTE4LTQ3LTI1LXF0aWQybTlhOG1mbWh6a2l5MTE2ajd0b2llamMvc2hlbGxfMV9vZl9tZnhfY2FyZF9ob2xkZXIuc3Rs'
  ]);
