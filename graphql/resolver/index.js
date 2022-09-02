
const User=require("../../models/user");
const Event=require("../../models/event");
const Booking = require("../../models/booking");




const user=async(userId)=>{
    const user=await User.findById(userId);
    return {...user._doc,_id:user.id,createdEvents:events.bind(this,user._doc.createdEvents)}
}


const events=async(eventIds)=>{
    const events=await Event.find({_id:{$in:eventIds}});
    return events.map(event=>{
        return {...event._doc,_id:event.id,creator:user.bind(this,event._doc.creator)}
    })
}

const event=async eventId=>{
    const event=await Event.findById(eventId);
    return {...event._doc,_id:event.id,creator:user.bind(this,event._doc.creator),date:new Date(event._doc.date)};
}



module.exports.graphqlResolver={
    events:async ()=>{
        const events=await Event.find();
        return events.map(event=>{
            return {...event._doc,_id:event.id,creator:user.bind(this,event.creator),date:new Date(event._doc.date)}
        })
    },
    bookings:async ()=>{
        const bookings=await Booking.find()
        return bookings.map(booking=>{
            return {...booking._doc,_id:booking.id,user:user.bind(this,booking._doc.user),event:event.bind(this,booking._doc.event)}
        })
    },
    createEvent:async args=>{
        const event=new Event({
            title:args.createEvent.title,
            description:args.createEvent.description,
            price:args.createEvent.price,
            date:new Date(args.createEvent.date),
            creator:"6311f8bb54610dbe8ca09a35"
            
        })

        const newEvent=await event.save();

        const eventCreator=await User.findById(newEvent.creator);

        if(eventCreator) {
            eventCreator.createdEvents.push(newEvent);
            await eventCreator.save();
        }else{
            throw new Error("user not found")
        }

        return {...newEvent._doc,_id:newEvent.id,date:new Date(newEvent._doc.date),creator:user.bind(this,newEvent.creator)}
    },

    createUser:async args =>{
        const userExists=await User.findOne({email:args.createUser.email});
        if(userExists) {
            throw new Error("Email already in use")
        }else{
            const user=new User({
                email:args.createUser.email,
                password:args.createUser.password
            })

            const newUser=await user.save();
            return {...newUser._doc,password:null,_id:newUser.id,createdEvents:events.bind(this,newUser._doc.createdEvents)}
        }
        

        
    },

    bookEvent:async args =>{
            const eventSearched=await Event.findById(args.eventId);
            if(eventSearched) {
                const booking=new Booking({
                    event:eventSearched,
                    user:"6311f8bb54610dbe8ca09a35"
                })
                const newBooking=await booking.save();
                return {...newBooking._doc,_id:newBooking.id,user:user.bind(this,newBooking._doc.user),event:event.bind(this,newBooking._doc.event)}
            }else{
                throw new Error("event doesnot exist");
            }
    },

    cancelBooking:async args =>{
        
    }


}

