import React from 'react';
import { connect } from 'react-redux';
import SideBar from '../components/SideBar';
import './style/Dashboard.css';

var data = [
  { id: 1, category: "1. Académico", accent: "#1d3557", light: "#d0e8f7" ,
    topics: [
      { id: 11, name: "Alumnos", url: "http://136.113.129.29:3000/public-dashboards/839282d0faa34dac95d1b98944d56298" },
      { id: 12, name: "Matrícula", url: "http://136.113.129.29:3000/public-dashboards/ed1db971eff94c5e9467d1153e929671" },
      { id: 13, name: "Personal administrativo y docente", url: "http://136.113.129.29:3000/public-dashboards/593a59e56b0541cfaaefd4e5da02dfc1" }
    ]
  },
  { id: 2, category: "2. Infraestructura", accent: "#7d5a00", light: "#fdefc3",
    topics: [
      { id: 21, name: "Componente Físico", url: "http://136.113.129.29:3000/public-dashboards/96348b163c4b41eb811a52c01e5310cb" }
    ]
  },
  { id: 3, category: "3. Ambiental", accent: "#1b7a4a", light: "#d5f5e3",
    topics: [
      { id: 31, name: "Biodiversidad de fauna y flora", url: "http://136.113.129.29:3000/public-dashboards/94c22199ae404a91b452a389f66b9040" },
      { id: 32, name: "Componente hidrológico", url: "http://136.113.129.29:3000/public-dashboards/a3d6ca7e0d3b4b2987e165cc572b904a" },
      { id: 33, name: "Contexto regional: generalidades ambientales del municipio de Arauca", url: "http://136.113.129.29:3000/public-dashboards/3a6cefa7639c4d4baacfe35e42d43eea" },
      { id: 34, name: "Sendero ecológico y granja experimental", url: "http://136.113.129.29:3000/public-dashboards/3a6cefa7639c4d4baacfe35e42d43eea" }
    ]
  },
  { id: 4, category: "4. Ordenamiento Territorial",accent: "#9C1607", light: "#FCC1BB" ,
    topics: [
      { id: 41, name: "Uso del suelo", url: "http://136.113.129.29:3000/public-dashboards/a557894c82ce454d921d8244f3e3addc" },
      { id: 42, name: "Zonificación ecológica ambiental", url: "http://136.113.129.29:3000/public-dashboards/dd5ef5c1adba48feb13222f621798083" }
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
        {topic.name}
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
          border: "1.5px solid " + (isOpen ? cat.accent + "44" : "#e2e8f0"),
          boxShadow: isOpen ? "0 4px 20px " + cat.accent + "15" : "0 1px 4px rgba(0,0,0,0.05)"
        }}
      >
        <button className="category-btn" onClick={this.toggle}>
          <div
            className={"category-number " + (isOpen ? "open" : "closed")}
            style={{
              background: isOpen ? cat.accent : cat.light,
              color: isOpen ? "#fff" : cat.accent
            }}
          >
            {cat.id}
          </div>
          <div style={{ flex: 1 }}>
            <div
              className={"category-name " + (isOpen ? "open" : "closed")}
      
            >
              {cat.category.split(". ")[1]}
            </div>
            <div className="category-subtitle">
              {cat.topics.length} {cat.topics.length === 1 ? "tema" : "temas"}
            </div>
          </div>
          <span
            className={"category-arrow " + (isOpen ? "open" : "closed")}
            style={{ color: isOpen ? cat.accent : "#a0aec0" }}
          >▼</span>
        </button>

        <div
          className="topics-container"
          style={{ maxHeight: isOpen ? (cat.topics.length * 46) + "px" : "0" }}
        >
          <div
            className="topics-inner"
            style={{ borderLeft: "2px solid " + cat.accent + "22" }}
          >
            {cat.topics.map(function(topic) {
              return <TopicLink key={topic.id} topic={topic} accent={cat.accent}  />;
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
      <SideBar icon="tools" id="Dashboard" onHide={this.onHide} onShow={this.onShow} side="right" title="Dashboard" width="30em">
        {() => ({ body: this.renderBody() })}
      </SideBar>
    );
  }
  renderBody() {
    return (
      <div className="dashboard-body">
        <div className="dashboard-header">
          <p className="dashboard-label">Tableros de control</p>
          <h2 className="dashboard-title">SIG Orinoquia</h2>
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