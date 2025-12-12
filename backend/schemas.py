from marshmallow import Schema, fields
class UserSchema(Schema):
 id = fields.Int()
 email = fields.Str()
 name = fields.Str()
class MatchSchema(Schema):
 id = fields.Int()
 title = fields.Str()
 date = fields.DateTime()
 venue = fields.Str()
 video_path = fields.Str()
class EventSchema(Schema):
 id = fields.Int()
 match_id = fields.Int()
 event_type = fields.Str()
 minute = fields.Int()
 x = fields.Int()
 y = fields.Int()
 metadata = fields.Str()
