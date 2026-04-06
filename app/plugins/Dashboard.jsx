import React from 'react';
import { connect } from 'react-redux';
import SideBar from '../components/SideBar';
import LocaleUtils from '../utils/LocaleUtils';
import './style/Dashboard.css';

var data = [
  {
    "nombre": "Académico",
    "color_acento": "#1d3557",
    "color_claro": "#d0e8f7",
    "id": 1,
    "temas": [
      {
        "nombre": "Matrícula",
        "url": "http://136.113.129.29:3000/public-dashboards/ed1db971eff94c5e9467d1153e929671",
        "id": 2
      },
      {
        "nombre": "Alumnos",
        "url": "http://136.113.129.29:3000/public-dashboards/839282d0faa34dac95d1b98944d56298",
        "id": 1
      },
      {
        "nombre": "Personal administrativo y docente",
        "url": "http://136.113.129.29:3000/public-dashboards/593a59e56b0541cfaaefd4e5da02dfc1",
        "id": 3
      }
    ]
  },
  {
    "nombre": "Infraestructura",
    "color_acento": "#7d5a00",
    "color_claro": "#fdefc3",
    "id": 2,
    "temas": [
      {
        "nombre": "Redes",
        "url": "http://136.113.129.29:3000/public-dashboards/2c0b3c8c228c4f8e9d307fc099bed462",
        "id": 13
      },
      {
        "nombre": "Componente Físico",
        "url": "http://136.113.129.29:3000/public-dashboards/96348b163c4b41eb811a52c01e5310cb",
        "id": 5
      },
      {
        "nombre": "Inventario Infraestructura",
        "url": "http://136.113.129.29:3000/public-dashboards/96348b163c4b41eb811a52c01e5310cb",
        "id": 4
      }
    ]
  },
  {
    "nombre": "Ambiental",
    "color_acento": "#1b7a4a",
    "color_claro": "#d5f5e3",
    "id": 3,
    "temas": [
      {
        "nombre": "Sendero ecológico y granja experimental",
        "url": "http://136.113.129.29:3000/public-dashboards/44cd8b1141e84f2faf73bf90f995054b",
        "id": 9
      },
      {
        "nombre": "Biodiversidad de fauna y flora",
        "url": "http://136.113.129.29:3000/public-dashboards/94c22199ae404a91b452a389f66b9040",
        "id": 6
      },
      {
        "nombre": "Componente hidrológico",
        "url": "http://136.113.129.29:3000/public-dashboards/a3d6ca7e0d3b4b2987e165cc572b904a",
        "id": 7
      },
      {
        "nombre": "Contexto regional: generalidades ambientales del municipio de Arauca",
        "url": "http://136.113.129.29:3000/public-dashboards/3a6cefa7639c4d4baacfe35e42d43eea",
        "id": 8
      }
    ]
  },
  {
    "nombre": "Ordenamiento Territorial",
    "color_acento": "#9C1607",
    "color_claro": "#FCC1BB",
    "id": 4,
    "temas": [
      {
        "nombre": "Uso del suelo",
        "url": "http://136.113.129.29:3000/public-dashboards/a557894c82ce454d921d8244f3e3addc",
        "id": 11
      },
      {
        "nombre": "Amenaza por inundación",
        "url": "http://136.113.129.29:3000/public-dashboards/eb73cde87aa0456286e533563fb36263",
        "id": 10
      },
      {
        "nombre": "Zonificación ecológica ambiental",
        "url": "http://136.113.129.29:3000/public-dashboards/dd5ef5c1adba48feb13222f621798083",
        "id": 12
      }
    ]
  }
];

class TopicLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hovered: false };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
  }
  handleEnter() { this.setState({ hovered: true }); }
  handleLeave() { this.setState({ hovered: false }); }
  render() {
    var topic = this.props.topic;
    var accent = this.props.accent;
    return (
      <a
        href={topic.url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={this.handleEnter}
        onMouseLeave={this.handleLeave}
        className="topic-link"
        
      >
        <svg className="topic-icon" width="11" height="11" viewBox="0 0 14 14" fill="none">
          <rect x="0" y="0" width="6" height="6" rx="1.2" fill={accent} stroke="white" strokeWidth="0.8" />
          <rect x="8" y="0" width="6" height="6" rx="1.2" fill={accent} stroke="white" strokeWidth="0.8" />
          <rect x="0" y="8" width="6" height="6" rx="1.2" fill={accent}  stroke="white" strokeWidth="0.8" />
          <rect x="8" y="8" width="6" height="6" rx="1.2" fill={accent} stroke="white" strokeWidth="0.8" />
        </svg>
        {topic.nombre}
      </a>
    );
  }
}

class CategoryCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState(function(prev) { return { isOpen: !prev.isOpen }; });
  }
  render() {
    var cat = this.props.cat;
    var isOpen = this.state.isOpen;
    return (
      <div
        className={"category-card" + (isOpen ? " open" : "")}
        style={{
          border: "1.5px solid " + (isOpen ? cat.color_acento + "44" : "#e2e8f0"),
          boxShadow: isOpen ? "0 4px 20px " + cat.color_acento + "15" : "0 1px 4px rgba(0,0,0,0.05)"
        }}
      >
        <button className="category-btn" onClick={this.toggle}>
          <div
            className={"category-number " + (isOpen ? "open" : "closed")}
            style={{
              background: isOpen ? cat.color_acento : cat.color_claro,
              color: isOpen ? "#fff" : cat.color_acento
            }}
          >
            {cat.id}
          </div>
          <div style={{ flex: 1 }}>
            <div
              className={"category-name " + (isOpen ? "open" : "closed")}
      
            >
              {cat.nombre}
            </div>
            <div className="category-subtitle">
              {cat.temas.length} {cat.temas.length === 1 ? "tema" : "temas"}
            </div>
          </div>
          <span
            className={"category-arrow " + (isOpen ? "open" : "closed")}
            style={{ color: isOpen ? cat.color_acento : "#a0aec0" }}
          >▼</span>
        </button>

        <div
          className="topics-container"
          style={{ maxHeight: isOpen ? (cat.temas.length * 46) + "px" : "0" }}
        >
          <div
            className="topics-inner"
            style={{ borderLeft: "2px solid " + cat.color_acento + "22" }}
          >
            {cat.temas.map(function(topic) {
              return <TopicLink key={topic.id} topic={topic} accent={cat.color_acento}  />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

class Dashboard extends React.Component {
  onShow() { console.log("Dashboard abierto"); }
  onHide() { console.log("Dashboard cerrado"); }
  render() {
    return (
      <SideBar icon="dashboard" id="Dashboard" onHide={this.onHide} onShow={this.onShow}
       side="right" title={LocaleUtils.tr("appmenu.items.Dashboard")} width="30em">
        {() => ({ body: this.renderBody() })}
      </SideBar>
    );
  }
  renderBody() {
    return (
      <div className="dashboard-body">
        <div className="dashboard-header">
    
          <h2 className="dashboard-title">SIG Orinoquia</h2>
          <p className="dashboard-label">Temáticas</p>
          <div className="dashboard-divider" />
        </div>
        {data.map(function(cat) {
          return <CategoryCard key={cat.id} cat={cat} />;
        })}
      </div>
    );
  }
}

export default connect(function(state) { return {}; }, {})(Dashboard);