local classNames = {
	"Accessory",
	"AccessoryDescription",
	"Accoutrement",
	"Actor",
	"AdGui",
	"AdPortal",
	"AirController",
	"AlignOrientation",
	"AlignPosition",
	"AngularVelocity",
	"Animation",
	"AnimationConstraint",
	"AnimationController",
	"AnimationRigData",
	"Animator",
	"ArcHandles",
	"Atmosphere",
	"Attachment",
	"AudioAnalyzer",
	"AudioChorus",
	"AudioCompressor",
	"AudioDeviceInput",
	"AudioDeviceOutput",
	"AudioDistortion",
	"AudioEcho",
	"AudioEmitter",
	"AudioEqualizer",
	"AudioFader",
	"AudioFlanger",
	"AudioListener",
	"AudioPitchShifter",
	"AudioPlayer",
	"AudioReverb",
	"AudioSearchParams",
	"Backpack",
	"BallSocketConstraint",
	"Beam",
	"BillboardGui",
	"BindableEvent",
	"BindableFunction",
	"BlockMesh",
	"BloomEffect",
	"BlurEffect",
	"BodyAngularVelocity",
	"BodyColors",
	"BodyForce",
	"BodyGyro",
	"BodyPartDescription",
	"BodyPosition",
	"BodyThrust",
	"BodyVelocity",
	"Bone",
	"BoolValue",
	"BoxHandleAdornment",
	"Breakpoint",
	"BrickColorValue",
	"BubbleChatMessageProperties",
	"BuoyancySensor",
	"Camera",
	"CanvasGroup",
	"CFrameValue",
	"CharacterMesh",
	"ChorusSoundEffect",
	"ClickDetector",
	"ClimbController",
	"Clouds",
	"Color3Value",
	"ColorCorrectionEffect",
	"CompressorSoundEffect",
	"ConeHandleAdornment",
	"Configuration",
	"ControllerManager",
	"ControllerPartSensor",
	"CornerWedgePart",
	"CurveAnimation",
	"CylinderHandleAdornment",
	"CylinderMesh",
	"CylindricalConstraint",
	"DataStoreGetOptions",
	"DataStoreIncrementOptions",
	"DataStoreOptions",
	"DataStoreSetOptions",
	"Decal",
	"DepthOfFieldEffect",
	"Dialog",
	"DialogChoice",
	"DistortionSoundEffect",
	"DoubleConstrainedValue",
	"DragDetector",
	"Dragger",
	"EchoSoundEffect",
	"EditableImage",
	"EditableMesh",
	"EqualizerSoundEffect",
	"EulerRotationCurve",
	"ExperienceInviteOptions",
	"Explosion",
	"FaceControls",
	"FileMesh",
	"Fire",
	"FlangeSoundEffect",
	"FloatCurve",
	"FloorWire",
	"Folder",
	"ForceField",
	"Frame",
	"GetTextBoundsParams",
	"Glue",
	"GroundController",
	"Handles",
	"Hat",
	"HiddenSurfaceRemovalAsset",
	"Highlight",
	"HingeConstraint",
	"Hole",
	"Humanoid",
	"HumanoidController",
	"HumanoidDescription",
	"IKControl",
	"ImageButton",
	"ImageHandleAdornment",
	"ImageLabel",
	"IntConstrainedValue",
	"InternalSyncItem",
	"IntersectOperation",
	"IntValue",
	"Keyframe",
	"KeyframeMarker",
	"KeyframeSequence",
	"LinearVelocity",
	"LineForce",
	"LineHandleAdornment",
	"LocalizationTable",
	"LocalScript",
	"ManualGlue",
	"ManualWeld",
	"MarkerCurve",
	"MaterialVariant",
	"MeshPart",
	"Model",
	"ModuleScript",
	"Motor",
	"Motor6D",
	"MotorFeature",
	"NegateOperation",
	"NoCollisionConstraint",
	"NumberPose",
	"NumberValue",
	"ObjectValue",
	"OperationGraph",
	"Pants",
	"Part",
	"ParticleEmitter",
	"PartOperation",
	"Path2D",
	"PathfindingLink",
	"PathfindingModifier",
	"PitchShiftSoundEffect",
	"Plane",
	"PlaneConstraint",
	"PluginCapabilities",
	"PointLight",
	"Pose",
	"PrismaticConstraint",
	"ProximityPrompt",
	"RayValue",
	"RemoteEvent",
	"RemoteFunction",
	"ReverbSoundEffect",
	"RigidConstraint",
	"RobloxEditableImage",
	"RocketPropulsion",
	"RodConstraint",
	"RopeConstraint",
	"Rotate",
	"RotateP",
	"RotateV",
	"RotationCurve",
	"ScreenGui",
	"Script",
	"ScrollingFrame",
	"Seat",
	"SelectionBox",
	"SelectionPartLasso",
	"SelectionPointLasso",
	"SelectionSphere",
	"Shirt",
	"ShirtGraphic",
	"SkateboardController",
	"SkateboardPlatform",
	"Sky",
	"Smoke",
	"Snap",
	"Sound",
	"SoundGroup",
	"Sparkles",
	"SpawnLocation",
	"SpecialMesh",
	"SphereHandleAdornment",
	"SpotLight",
	"SpringConstraint",
	"StarterGear",
	"StringValue",
	"StudioAttachment",
	"StudioCallout",
	"StyleDerive",
	"StyleLink",
	"StyleRule",
	"StyleSheet",
	"SunRaysEffect",
	"SurfaceAppearance",
	"SurfaceGui",
	"SurfaceLight",
	"SurfaceSelection",
	"SwimController",
	"Team",
	"TeleportOptions",
	"TerrainDetail",
	"TerrainRegion",
	"TextBox",
	"TextButton",
	"TextChannel",
	"TextChatCommand",
	"TextChatMessageProperties",
	"TextLabel",
	"Texture",
	"Tool",
	"Torque",
	"TorsionSpringConstraint",
	"TrackerStreamAnimation",
	"Trail",
	"TremoloSoundEffect",
	"TrussPart",
	"UIAspectRatioConstraint",
	"UICorner",
	"UIDragDetector",
	"UIFlexItem",
	"UIGradient",
	"UIGridLayout",
	"UIListLayout",
	"UIPadding",
	"UIPageLayout",
	"UIScale",
	"UISizeConstraint",
	"UIStroke",
	"UITableLayout",
	"UITextSizeConstraint",
	"UnionOperation",
	"UniversalConstraint",
	"UnreliableRemoteEvent",
	"UserNotification",
	"UserNotificationPayload",
	"UserNotificationPayloadAnalyticsData",
	"UserNotificationPayloadJoinExperience",
	"UserNotificationPayloadParameterValue",
	"Vector3Curve",
	"Vector3Value",
	"VectorForce",
	"VehicleController",
	"VehicleSeat",
	"VelocityMotor",
	"VideoFrame",
	"ViewportFrame",
	"WedgePart",
	"Weld",
	"WeldConstraint",
	"Wire",
	"WireframeHandleAdornment",
	"WorldModel",
	"WrapLayer",
	"WrapTarget",
}

local tags = {}

for _, className in classNames do
	tags[string.lower(className)] = className
end

return tags
