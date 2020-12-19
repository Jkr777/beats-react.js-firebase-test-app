import React,{Component} from 'react';
import DashLayout from '../../../utils/dash_layout';

import { messagesCollection } from '../../../utils/fbase';
import CardMessage from './card';

class Messages extends Component {
    state = {
        posts:[],
        limit:2,
        count:2
    }

    componentDidMount(){
        messagesCollection.orderBy('createdAt')
        .limit(this.state.limit)
        .get()
        .then( snapshot => {
           this.handleVars(snapshot,false);
        })
    }

    nextPosts = () => {
        messagesCollection.orderBy('createdAt').startAfter(this.state.last)
        .limit(this.state.limit)
        .get()
        .then( snapshot => {
            if(snapshot.docs.length > 0){
                this.handleVars(snapshot,'sum');
            } else {
                console.log('sorry its the end');
            }
        })
    }

    prevPosts = () => {
        if(this.state.count <= this.state.limit){
            console.log('sorry dude, no more posts')
        } else {
            messagesCollection.orderBy('createdAt').endBefore(this.state.first)
            .limit(this.state.limit)
            .get()
            .then( snapshot => {
               this.handleVars(snapshot,'rest');
            })
        }
    }


    handleVars = (snapshot,action) => {
        const {count} = this.state;
        const {docs} = snapshot;

        const posts = docs.map(doc =>({
            id: doc.id, ...doc.data()
        }));

        const lastVisible = docs[docs.length-1];
        const firstVisible = docs[0];

        const restSum = action === 'sum' ? 
                        count + docs.length :
                        count - docs.length;

        this.setState( prev => ({
            posts:posts,
            last:lastVisible,
            first:firstVisible,
            count: !action ? prev.count : restSum
        }))
    }

    render(){
        console.log(this.state)
        return(
            <DashLayout
                auth={this.props.auth}
                title="Messages"
            >
                {
                    this.state.posts.map(item=>(
                        <CardMessage
                            data={item}
                            key={item.id}
                        />
                    ))
                }
                <div className="mt-3">
                    <div className="btn btn-primary mr-2" onClick={this.prevPosts}>PREV</div>
                    <div className="btn btn-primary mr-2" onClick={this.nextPosts}>NEXT</div>
                </div>
            </DashLayout>
        )
    }
}

export default Messages;