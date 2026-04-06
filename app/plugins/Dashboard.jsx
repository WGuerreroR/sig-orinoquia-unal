import React from 'react';
import { connect } from 'react-redux';
import SideBar from '../components/SideBar';
import LocaleUtils from '../utils/LocaleUtils';
import axios from 'axios';
import './style/Dashboard.css';
import ConfigUtils from '../utils/ConfigUtils';


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
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      error: null
    };
  }

  onShow() { console.log("Dashboard abierto"); }
  onHide() { console.log("Dashboard cerrado"); }

  componentDidMount() {
    const dashboardServiceUrl = ConfigUtils.getConfigProp("dashboardServiceUrl").replace(/\/$/, '');
   
    axios.get(dashboardServiceUrl)
      .then(res => {
        this.setState({
          data: res.data,
          loading: false
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          error: "Error cargando datos",
          loading: false
        });
      });
  }

  render() {
    return (
      <SideBar
        icon="dashboard"
        id="Dashboard"
        onHide={this.onHide}
        onShow={this.onShow}
        side="right"
        title={LocaleUtils.tr("appmenu.items.Dashboard")}
        width="30em"
      >
        {() => ({ body: this.renderBody() })}
      </SideBar>
    );
  }

  renderBody() {
    const { data, loading, error } = this.state;

    if (loading) {
      return <div className="dashboard-body">Cargando...</div>;
    }

    if (error) {
      return <div className="dashboard-body">{error}</div>;
    }

    return (
      <div className="dashboard-body">
        <div className="dashboard-header">
          <h2 className="dashboard-title">SIG Orinoquia</h2>
          <p className="dashboard-label">Temáticas</p>
          <div className="dashboard-divider" />
        </div>

        {data.map(cat => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>
    );
  }
}


export default connect(function(state) { return {}; }, {})(Dashboard);