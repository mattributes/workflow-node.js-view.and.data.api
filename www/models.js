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

generateModelsDom(App.getAllDocumentUrns());
