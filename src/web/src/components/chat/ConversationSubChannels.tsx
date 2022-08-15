import React, { useMemo } from 'react'
import { SubChannel } from '../../models/channel/Channel.model'
import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { chatActions } from '../../store/chat/chatReducer';
import { useDispatch } from 'react-redux';

const mapChannelsToTree = (rootKey: string,rootName: string, channels: SubChannel[])=>{
    const treeData :DataNode[] = []
    if(!channels || channels.length===9) return [];
    const group : {
        [key:string] : SubChannel[]
    } ={}

    channels = channels.sort((a,b)=>{
       return a.channelLevel - b.channelLevel
    })

    for(const channel of channels){
        const parrentId = channel.parentId || rootKey;
        if(group[parrentId]){
            group[parrentId].push(channel);
        }else{
            group[parrentId] = [channel];
        }
    }

    const rootNode : DataNode= {
        title: rootName,
        key: rootKey,
        children: [
        ]
    }
    const groupToTree = (node: DataNode)=>{
        const channelChildrens =  group[node.key]
        if(!channelChildrens) return;
        node.children = channelChildrens.map(o=> ({
            title: o.name,
            key: o.id,
            children: [
            ]
        }))

        for(const child of  node.children){
            groupToTree(child)
        }
    }

    groupToTree(rootNode)

    return [rootNode];
}
interface ConversationSubChannelsProps {
    channelId: string,
    channelName: string,
    subchannels: SubChannel[]
}
const ConversationSubChannels: React.FC<ConversationSubChannelsProps> = ({ channelId,channelName, subchannels }) => {
    const dispatch = useDispatch()
    const treeData = useMemo(() => {
        const treeData=  mapChannelsToTree(channelId,channelName, subchannels);
        return treeData;
    }, [subchannels])
    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        if(!selectedKeys || selectedKeys.length===0) return;
        const id = selectedKeys[0].toString();
        if(id!== channelId){
            dispatch(chatActions.selectConversation(id))
        }
    };
    if(!subchannels || subchannels.length ===0)
        return (
            <div style={{marginTop: 10, textAlign:'center'}}>
                Chưa có kênh con
            </div>
        )
    return (
        <div>
            <div style={{marginBottom: 10}}>
                Kênh con:
            </div>
         
            <Tree
                showLine={{showLeafIcon:false}}
                defaultExpandAll
                switcherIcon={<DownOutlined />}
                onSelect={onSelect}
                treeData={treeData}
            />
        </div>
    )
}

export default ConversationSubChannels