var React = require('react');
var ReactDOM = require('react-dom');
var SemanticTouch = require('semantic-ui-react');
import 'semantic-ui-css/semantic.min.css';

var Card = SemanticTouch.Card;
var Icon = SemanticTouch.Icon;
var Image = SemanticTouch.Image;

const CardExampleCard = () => (
  <Card>
    <Image src='../../lib/img/matthew.png' />
    <Card.Content>
      <Card.Header>
        Matthew
      </Card.Header>
      <Card.Meta>
        <span className='date'>
          Joined in 2015
        </span>
      </Card.Meta>
      <Card.Description>
        Matthew is a musician living in Nashville.
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <a>
        <Icon name='user' />
        22 Friends
      </a>
    </Card.Content>
  </Card>
)

ReactDOM.render(<CardExampleCard />, document.getElementById('root'));