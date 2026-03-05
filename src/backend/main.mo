import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module Message {
    public func compareByTimestampDesc(m1 : Message, m2 : Message) : Order.Order {
      Int.compare(m2.timestamp, m1.timestamp);
    };
  };
  type Message = {
    channelId : Nat;
    authorId : Principal;
    authorName : Text;
    content : Text;
    timestamp : Int;
  };

  module Channel {
    public func compareById(c1 : Channel, c2 : Channel) : Order.Order {
      Nat.compare(c1.id, c2.id);
    };
  };
  type Channel = {
    id : Nat;
    name : Text;
    description : Text;
  };

  type StudentProfile = {
    displayName : Text;
    phoneNumber : ?Text;
    instagramHandle : ?Text;
  };

  let messages = List.empty<Message>();

  let channels = Map.empty<Nat, Channel>();
  let profiles = Map.empty<Principal, StudentProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialize channels
  public shared ({ caller }) func initializeChannels() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize channels");
    };

    let initialChannels = [
      (0, { id = 0; name = "Homework Help"; description = "Ask and answer homework questions" }),
      (1, { id = 1; name = "General Chat"; description = "Talk about anything!" }),
      (2, { id = 2; name = "Math"; description = "Discuss math topics and problems" }),
      (3, { id = 3; name = "Science"; description = "Science discussions" }),
      (4, { id = 4; name = "Arts & Creativity"; description = "Share your creative works" }),
      (5, { id = 5; name = "Sports & Fitness"; description = "Fitness and sports talk" }),
    ];

    for ((id, channel) in initialChannels.values()) {
      channels.add(id, channel);
    };
  };

  // Create or update profile
  public shared ({ caller }) func createOrUpdateProfile(displayName : Text, phoneNumber : ?Text, instagramHandle : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create or update profiles");
    };

    if (displayName.size() < 3 or displayName.size() > 20) {
      Runtime.trap("Display name must be between 3 and 20 characters");
    };

    let profile : StudentProfile = {
      displayName;
      phoneNumber;
      instagramHandle;
    };

    profiles.add(caller, profile);
  };

  // Get own profile
  public query ({ caller }) func getMyProfile() : async ?StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  // List all channels - accessible to any authenticated user including guests
  public query ({ caller }) func listChannels() : async [Channel] {
    channels.values().toArray().sort(Channel.compareById);
  };

  // Post message to channel
  public shared ({ caller }) func postMessage(channelId : Nat, content : Text) : async Message {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post messages");
    };

    if (content.isEmpty()) {
      Runtime.trap("Message cannot be empty");
    };

    if (content.size() > 500) {
      Runtime.trap("Message exceeds 500 character limit");
    };

    let channel = switch (channels.get(channelId)) {
      case (null) { Runtime.trap("Channel not found") };
      case (?c) { c };
    };

    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?p) { p };
    };

    let message : Message = {
      channelId;
      authorId = caller;
      authorName = profile.displayName;
      content;
      timestamp = Time.now();
    };

    messages.add(message);
    message;
  };

  // Get messages for channel (paginated, latest first) - accessible to any authenticated user including guests
  public query ({ caller }) func getChannelMessages(channelId : Nat, page : Nat) : async [Message] {
    let pageSize = 50;
    let start = page * pageSize;

    let filteredMessages = messages.toArray().filter(
      func(m) { m.channelId == channelId }
    );

    let sortedMessages = filteredMessages.sort(Message.compareByTimestampDesc);
    let totalMessages = sortedMessages.size();
    let end = Nat.min(start + pageSize, totalMessages);

    if (start >= totalMessages) {
      return [];
    };

    let paginatedMessages = Array.tabulate(
      end - start,
      func(i) { { index = start + i; message = sortedMessages[start + i] } },
    ).map(
      func(entry) { entry.message }
    );

    paginatedMessages;
  };

  // Get all messages for a channel - accessible to any authenticated user including guests
  public query ({ caller }) func getAllMessages(channelId : Nat) : async [Message] {
    let filteredMessages = messages.toArray().filter(
      func(m) { m.channelId == channelId }
    );
    filteredMessages.sort(Message.compareByTimestampDesc);
  };
};
