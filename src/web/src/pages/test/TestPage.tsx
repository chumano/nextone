import React, { useEffect, useState } from 'react'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import '../../styles/pages/test-page/test-page.scss';
import ChatItemsSample from './_ChatItemsSample';
import PlaceHolderSample from './_PlaceHolderSample';

const samples = [
    {
        id: 'placeholder',
        title: 'Place holder',
        component: PlaceHolderSample
    },
    {
        id: 'chatitem',
        title: 'Chat Items',
        component: ChatItemsSample
    }
]
const TestPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('placeholder');
    const toggle = (tab: string) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    return <>
        <div className="test-page">
            <div>
                <span className="page-title">Test pages</span>
            </div>

            <Nav tabs>
                {samples.map((item) => (
                    <NavItem key={item.id}>
                        <NavLink
                            className={"clickable " + (activeTab === item.id ? "active" : "")}
                            onClick={() => { toggle(item.id); }}
                        >
                            {item.title}
                        </NavLink>
                    </NavItem>
                ))}

                <NavItem>
                    <NavLink
                        className={"clickable " + (activeTab === 'other' ? "active" : "")}
                        onClick={() => { toggle('other'); }}
                    >
                        Others
                    </NavLink>
                </NavItem>
            </Nav>


            <TabContent activeTab={activeTab}>
                {samples.map((item) => (
                     <TabPane tabId={item.id} key={item.id}>
                     <item.component></item.component>
                 </TabPane>
                ))}
               
                <TabPane tabId="other">
                    {/* Other */}
                    <div className="test-page__component">
                        <div className="component-title">
                            Other
                        </div>
                    </div>
                </TabPane>

            </TabContent>
        </div>
    </>;
}

export default TestPage;
