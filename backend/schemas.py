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
 time = fields.Str()
 player = fields.Str()
 action = fields.Str()
 result = fields.Str()
 zone = fields.Int()
 metadata = fields.Str(attribute="meta_data")

class CustomButtonSchema(Schema):
  id = fields.Int()
  name = fields.Str()
  color = fields.Str()
