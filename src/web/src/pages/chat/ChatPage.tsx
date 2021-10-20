import React, { useEffect, useState } from 'react'
import 'react-chat-elements/dist/main.css';
import '../../styles/pages/chat/chat.scss';
import logo from '../../assets/logo.png';
import {
    ChatItem, MessageBox, MeetingMessage, MessageList,
    ChatList, Input, Popup, Dropdown,
    Avatar, MeetingItem, MeetingList
} from 'react-chat-elements';

import { MentionsInput, Mention } from 'react-mentions'
// https://www.npmjs.com/package/react-chat-elements-typescript
// memtions @input : https://github.com/signavio/react-mentions

const users = [
    {
        id: 'walter',
        display: 'Walter White',
    },
    {
        id: 'jesse',
        display: 'Jesse Pinkman',
    },
    {
        id: 'gus',
        display: 'Gustavo "Gus" Fring',
    },
    {
        id: 'saul',
        display: 'Saul Goodman',
    },
    {
        id: 'hank',
        display: 'Hank Schrader',
    },
    {
        id: 'skyler',
        display: 'Skyler White',
    },
    {
        id: 'mike',
        display: 'Mike Ehrmantraut',
    },
    {
        id: 'lydia',
        display: 'Lydìã Rôdarté-Qüayle',
    },
]

const tags = [{
    id: 'tag1',
    display: 'tagname 1',
},
{
    id: 'tag2',
    display: 'tagname 2',
}
]

const memtionStypes = {
    control: {
        backgroundColor: '#fff',
        fontSize: 14,
        fontWeight: 'normal',
    },

    '&multiLine': {
        control: {
            fontFamily: 'monospace',
            minHeight: 63,
        },
        highlighter: {
            padding: 9,
            border: '1px solid transparent',
        },
        input: {
            padding: 9,
            border: '1px solid silver',
        },
    },

    '&singleLine': {
        display: 'inline-block',
        width: 180,

        highlighter: {
            padding: 1,
            border: '2px inset transparent',
        },
        input: {
            padding: 1,
            border: '2px inset',
        },
    },

    suggestions: {
        list: {
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.15)',
            fontSize: 14,
        },
        item: {
            padding: '5px 15px',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
            '&focused': {
                backgroundColor: '#cee4e5',
            },
        },
    },
}
const ChatPage: React.FC = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [memtionValue, setMemtionValue] = useState("Hi @[John Doe](user:johndoe)");
    const [emojis, setEmojis] = useState([])

    useEffect(() => {
        fetch(
            'https://gist.githubusercontent.com/oliveratgithub/0bf11a9aff0d6da7b46f1490f86a71eb/raw/d8e4b78cfe66862cf3809443c1dba017f37b61db/emojis.json'
        )
            .then((response) => {
                return response.json()
            })
            .then((jsonData) => {
                setEmojis(jsonData.emojis)
            })
    }, [])

    const queryEmojis = (query: any, callback: any) => {
        if (query.length === 0) return

        const matches = emojis
            .filter((emoji: any) => {
                return emoji.name.indexOf(query.toLowerCase()) > -1
            })
            .slice(0, 10)
        return matches.map(({ emoji }) => ({ id: emoji }))
    }
    const neverMatchingRegex = /($a)/
    return (
        <div className="chat-page">
            <div className="chat-page__component">
                <label>MentionsInput</label>
                <MentionsInput value={memtionValue}
                    onChange={(event) => { setMemtionValue(event.target.value) }}
                    style={memtionStypes}>
                    <Mention style={{ backgroundColor: '#cee4e5' }}
                        trigger="@"
                        data={users}
                    />
                    <Mention style={{ backgroundColor: '#aaccbb' }}
                        trigger="#"
                        markup='#[__display__](__id__)'
                        data={tags}
                    />
                    <Mention
                        trigger=":"
                        markup="__id__"
                        regex={neverMatchingRegex}
                        data={queryEmojis}
                    />
                </MentionsInput>
                {memtionValue}
            </div>

            <div className="chat-page__component">
                <label>ChatItem</label>
                <ChatItem
                    avatar={logo}
                    alt={'Reactjs'}
                    title={'Facebook'}
                    subtitle={'What are you doing?'}
                    date={new Date()}
                    unread={0}
                />
            </div>

            <div className="chat-page__component">
                <label>MessageBox</label>
                <MessageBox
                    position={'left'}
                    type={'photo'}
                    text={'react.svg'}
                    data={{
                        uri: logo,
                        status: {
                            click: false,
                            loading: 0,
                        },
                    }}
                />
            </div>


            <div className="chat-page__component">
                <label>Rely MessageBox</label>
                <MessageBox
                    reply={{
                        photoURL: logo,
                        title: 'elit magna',
                        titleColor: '#8717ae',
                        message: 'Aliqua amet incididunt id nostrud',
                    }}
                    onReplyMessageClick={() => console.log('reply clicked!')}
                    position={'right'}
                    type={'text'}
                    text={
                        'Tempor duis do voluptate enim duis velit veniam aute ullamco dolore duis irure.'
                    }
                />
            </div>

            <div className="chat-page__component">
                <label>MeetingMessage (error: not show some items)</label>
                <MeetingMessage
                    subject={'New Release'}
                    title={'in ullamco'}
                    date={new Date()}
                    collapseTitle={'Commodo aliquip'}
                    participants={[
                        {
                            id: '1',
                            title: 'Facebook',
                        },
                        {
                            id: '2',
                            title: 'Yahoo',
                        }
                    ]}
                    dataSource={[
                        {
                            id: '1',
                            avatar: logo,
                            message: 'Lorem ipsum dolor sit amet.',
                            title: 'Elit magna',
                            avatarFlexible: true,
                            date: new Date(),
                            event: [{
                                title: 'Toplantı sona erdi!',
                                avatars: [{
                                    src: logo
                                }]
                            }],
                            record: [{
                                avatar: logo,
                                title: 'Arama',
                                savedBy: 'Kaydeden: Elit magna',
                                time: new Date(),
                            }]
                        },
                    ]} />
            </div>


            <div className="chat-page__component">
                <label>MessageList</label>
                <MessageList
                    className='message-list'
                    lockable={true}
                    toBottomHeight={'100$'}
                    dataSource={[
                        {
                            position: 'right',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(2020, 10, 1),
                        },
                        {
                            position: 'left',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(),
                        }, {
                            position: 'right',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(2020, 10, 1),
                        },
                        {
                            position: 'left',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(),
                        }, {
                            position: 'right',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(2020, 10, 1),
                        },
                        {
                            position: 'left',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(),
                        }, {
                            position: 'right',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(2020, 10, 1),
                        },
                        {
                            position: 'left',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(),
                        }, {
                            position: 'right',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(2020, 10, 1),
                        },
                        {
                            position: 'left',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(),
                        }, {
                            position: 'right',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(2020, 10, 1),
                        },
                        {
                            position: 'left',
                            type: 'text',
                            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                            date: new Date(),
                        },
                    ]} />
            </div>

            <div className="chat-page__component">
                <label>ChatList</label>
                <ChatList
                    className='chat-list'
                    dataSource={[
                        {
                            avatar: 'https://facebook.github.io/react/img/logo.svg',
                            alt: 'Reactjs',
                            title: 'Facebook',
                            subtitle: 'What are you doing?',
                            date: new Date(),
                            unread: 0,
                        },
                        {
                            avatar: 'https://facebook.github.io/react/img/logo.svg',
                            alt: 'Reactjs',
                            title: 'Yahoo',
                            subtitle: 'What are you doing?',
                            date: new Date(),
                            unread: 1,
                        }, {
                            avatar: 'https://facebook.github.io/react/img/logo.svg',
                            alt: 'Reactjs',
                            title: 'Facebook',
                            subtitle: 'What are you doing?',
                            date: new Date(),
                            unread: 0,
                        },
                        {
                            avatar: 'https://facebook.github.io/react/img/logo.svg',
                            alt: 'Reactjs',
                            title: 'Yahoo',
                            subtitle: 'What are you doing?',
                            date: new Date(),
                            unread: 1,
                        }, {
                            avatar: 'https://facebook.github.io/react/img/logo.svg',
                            alt: 'Reactjs',
                            title: 'Facebook',
                            subtitle: 'What are you doing?',
                            date: new Date(),
                            unread: 0,
                        },
                        {
                            avatar: 'https://facebook.github.io/react/img/logo.svg',
                            alt: 'Reactjs',
                            title: 'Yahoo',
                            subtitle: 'What are you doing?',
                            date: new Date(),
                            unread: 1,
                        }
                    ]} />
            </div>

            <div className="chat-page__component">
                <label>Input</label>
                <Input
                    placeholder="Type here..."
                    multiline={true}
                    rightButtons={
                        <span className="clickable">Send</span>
                    } />
            </div>


            <div className="chat-page__component">
                <label>Popup &nbsp;</label>
                <button onClick={() => { setShowPopup(true) }} >show popy</button>
                <Popup
                    show={showPopup}
                    header='Lorem ipsum dolor sit amet.'
                    headerButtons={[{
                        type: 'transparent',
                        color: 'black',
                        text: 'close',
                        onClick: () => {
                            setShowPopup(false)
                        }
                    }]}
                    text='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem animi veniam voluptas eius!'
                    footerButtons={[{
                        color: 'white',
                        backgroundColor: '#ff5e3e',
                        text: "Vazgeç",
                    }, {
                        color: 'white',
                        backgroundColor: 'lightgreen',
                        text: "Tamam",
                    }]} />
            </div>

            <div className="chat-page__component">
                <label>Dropdown</label>
                <Dropdown
                    buttonProps={{
                        text: 'Dropdown',
                    }}
                    items={[
                        {
                            icon: {
                                component: <img src={logo} />,
                                float: 'left',
                                color: 'red',
                                size: 22,
                            },
                            text: 'lorem'
                        },
                        {
                            icon: {
                                component: <img src={logo} />,
                                float: 'left',
                                color: 'purple',
                                size: 22,
                            },
                            text: 'ipsum'
                        },
                        {
                            text: 'dolor'
                        },
                    ]} />
            </div>


            <div className="chat-page__component">
                <label>Avatar</label>
                <Avatar
                    src={logo}
                    alt={'logo'}
                    size="large"
                    type="circle flexible" />
            </div>

            <div className="chat-page__component">
                <label>MeetingItem</label>
                <MeetingItem
                    subject={'New Release!!!'}
                    closable="true"
                    avatars={[
                        {
                            src: logo
                        },
                        {
                            src: logo
                        }
                    ]}
                    onMeetingClick={console.log}
                    onShareClick={console.log}
                    onCloseClick={console.log} />
            </div>

            <div className="chat-page__component">
                <label>MeetingList</label>
                <MeetingList
                    className='meeting-list'
                    dataSource={[
                        {
                            id: '1',
                            subject: 'New Release',
                            date: new Date(),
                            avatars: [{
                                src: logo,
                            }, {
                                src: logo,
                            }, {
                                src: logo,
                            }, {
                                src: logo,
                            }, {
                                src: logo,
                            }, {
                                src: logo,
                            }, {
                                src: logo,
                            }]
                        },
                        {
                            id: '2',
                            subject: 'New Release',
                            date: new Date(),
                            avatars: [{
                                src: logo,
                            }]
                        },
                        {
                            id: '2',
                            subject: 'New Release',
                            date: new Date(),
                            avatars: [{
                                src: logo,
                            }]
                        },
                        {
                            id: '2',
                            subject: 'New Release',
                            date: new Date(),
                            avatars: [{
                                src: 'https://facebook.github.io/react/img/logo.svg',
                            }]
                        },
                        {
                            id: '2',
                            subject: 'New Release',
                            date: new Date(),
                            avatars: [{
                                src: 'https://facebook.github.io/react/img/logo.svg',
                            }]
                        },
                    ]} />
            </div>

            <div className="chat-page__component">
                <label>Others</label>
            </div>
        </div>
    )
}


export default ChatPage;
