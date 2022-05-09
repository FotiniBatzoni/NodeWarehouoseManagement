const Joi = require("joi");
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    roleName:{
        type:String,
        required:true
    },
    priority:{
        type:Number,
        required:true
    },
    rights:{
        role:{
            canCreateRole:{
                type:Boolean,
                default:false
            },
            canUpdateRole:{
                type:Boolean,
                default:false
            },
            canDeleteRole:{
                 type:Boolean,
                 default:false
                }
        },
        user:{
            canCreateUser:{
                type:Boolean,
                default:false
            },
            canUpdateUser:{
                type:Boolean,
                default:false
            },
            canDeleteUser:{
                 type:Boolean,
                 default:false
                }
        },
        category:{
            canCreateCategory:{
                type:Boolean,
                default:false
            },
            canUpdateCategory:{
                type:Boolean,
                default:false
            },
            canDeleteCategory:{
                 type:Boolean,
                 default:false
                }
        },
        product:{
            canCreateProduct:{
                type:Boolean,
                default:false
            },
            canUpdateProduct:{
                type:Boolean,
                default:false
            },
            canDeleteProduct:{
                type:Boolean,
                default:false
            }
        },
        store:{
            canCreateStore:{
                type:Boolean,
                default:false
            },
            canUpdateStore:{
                type:Boolean,
                default:false
             },
            canDeleteStore:{
                type:Boolean,
                default:false
            },
        },
        invoice:{
            canCreateInvoice:{
                type:Boolean,
                default:true
            },
            canUpdateInvoice:{
                type:Boolean,
                default:true
            },
            canDeleteInvoice:{
                type:Boolean,
                default:false
            }
        },
        deliveryNote:{
            canCreateDeliveryNote:{
                type:Boolean,
                default:true
            },
            canUpdateDeliveryNote:{
                type:Boolean,
                default:true
            },
            canDeleteDeliveryNote:{
                type:Boolean,
                default:false
            }
        }

    },
    action:{
        type:String,
    },
})

const Role = mongoose.model("Role",roleSchema);

function validateRole(role){
    const schema = Joi.object({
        roleName:Joi.string().required().min(2).max(50)
        .messages({
            "any.required": `Role Name is a required field`,
            "string.min": `Role Name should have at least 8 letters length`,
            "string.max": `Role Name should have at most 50 letters length`,
            "string.empty": `Role Name should not be empty`
        }),
        priority:Joi.number().required().integer()
        .messages({
            "any.required": `Priority is a required field`,
            "string.empty": `Priority should not be empty`
        }),
        action:Joi.string().required().messages({
            "any.required": `Action is a required field`,
            "string.empty": `Action should not be empty`
        }),
       rights:Joi.object({
            role:Joi.object({
                canCreateRole:Joi.boolean().required().messages({
                    "any.boolean":`Can Create Role must be a boolean`,
                    "any.required": `Can Create Role is a required field`,
                    "string.empty": `Can Create Role should not be empty`
                }),
                canUpdateRole:Joi.boolean().required().messages({
                    "any.boolean":`Can Update Role must be a boolean`,
                    "any.required": `Can Update Role is a required field`,
                    "string.empty": `Can Update Role should not be empty`
                }),
                canDeleteRole:Joi.boolean().required().messages({
                    "any.boolean":`Can Delete Role must be a boolean`,
                    "any.required": `Can Delete Role is a required field`,
                    "string.empty": `Can Delete Role should not be empty`
            })
            .required().messages({
                    "any.required":`Role is required field`,
                    "string.empty":`Role should not be an empty string`
                })
            }),
            user:Joi.object({
                    canCreateUser:Joi.boolean().required().messages({
                        "any.boolean":`Can Create User must be a boolean`,
                        "any.required": `Can Create User is a required field`,
                        "string.empty": `Can Create User should not be empty`
                    }),
                    canUpdateUser:Joi.boolean().required().messages({
                        "any.boolean":`Can Update User must be a boolean`,
                        "any.required": `Can Update User is a required field`,
                        "string.empty": `Can Update User should not be empty`
                    }),
                    canDeleteUser:Joi.boolean().required().messages({
                        "any.boolean":`Can Delete User must be a boolean`,
                        "any.required": `Can Delete User is a required field`,
                        "string.empty": `Can Delete User should not be empty`    
            })
            .required().messages({
                "any.required":`User is required field`,
                "string.empty":`User should not be an empty string`
            })
            }),
            store:Joi.object({
                canCreateStore:Joi.boolean().required().messages({
                    "any.boolean":`Can Create Store must be a boolean`,
                    "any.required": `Can Create Store is a required field`,
                    "string.empty": `Can Create Store should not be empty`
                }),
                canUpdateStore:Joi.boolean().required().messages({
                    "any.boolean":`Can Update Store must be a boolean`,
                    "any.required": `Can Update Store is a required field`,
                    "string.empty": `Can Update Store should not be empty`
                }),
                canDeleteStore:Joi.boolean().required().messages({
                    "any.boolean":`Can Delete Store must be a boolean`,
                    "any.required": `Can Delete Store is a required field`,
                    "string.empty": `Can Delete Store should not be empty`
             })
             .required().messages({
                "any.required":`Store is required field`,
                "string.empty":`Store should not be an empty string`
            })
             }),
            category:Joi.object({
                canCreateCategory:Joi.boolean().required().messages({
                    "any.boolean":`Can Create Category must be a boolean`,
                    "any.required": `Can Create Category is a required field`,
                    "string.empty": `Can Create Category should not be empty`
                }),
                canUpdateCategory:Joi.boolean().required().messages({
                    "any.boolean":`Can Update Category must be a boolean`,
                    "any.required": `Can Update Category is a required field`,
                    "string.empty": `Can Update Category should not be empty`
                }),
                canDeleteCategory:Joi.boolean().required().messages({
                    "any.boolean":`Can Delete Category must be a boolean`,
                    "any.required": `Can Delete Category is a required field`,
                    "string.empty": `Can Delete Category should not be empty`
                })
             .required().messages({
                "any.required":`Category is required field`,
                "string.empty":`Category should not be an empty string`
                }),
            }),
            product:Joi.object({
                canCreateProduct:Joi.boolean().required().messages({
                    "any.boolean":`Can Create Product must be a boolean`,
                    "any.required": `Can Create Product is a required field`,
                    "string.empty": `Can Create Product should not be empty`
                }),
                canUpdateProduct:Joi.boolean().required().messages({
                    "any.boolean":`Can Update Product must be a boolean`,
                    "any.required": `Can Update Product is a required field`,
                    "string.empty": `Can Update Product should not be empty`
                }),
                canDeleteProduct:Joi.boolean().required().messages({
                    "any.boolean":`Can Delete Product must be a boolean`,
                    "any.required": `Can Delete Product is a required field`,
                    "string.empty": `Can Delete Product should not be empty`
                 })
             .required().messages({
                "any.required":`Product is required field`,
                "string.empty":`Product should not be an empty string`
                })
            }),
            invoice:Joi.object({
                canCreateInvoice:Joi.boolean().required().messages({
                    "any.boolean":`Can Create Invoice must be a boolean`,
                    "any.required": `Can Create Invoice is a required field`,
                    "string.empty": `Can Create Invoice should not be empty`
                }),
                canUpdateInvoice:Joi.boolean().required().messages({
                    "any.boolean":`Can Update Invoice must be a boolean`,
                    "any.required": `Can Update Invoice is a required field`,
                    "string.empty": `Can Update Invoice should not be empty`
                }),
                canDeleteInvoice:Joi.boolean().required().messages({
                    "any.boolean":`Can Delete Invoice must be a boolean`,
                    "any.required": `Can Delete Invoice is a required field`,
                    "string.empty": `Can Delete Invoice should not be empty`
                })
             .required().messages({
                "any.required":`Invoice is required field`,
                "string.empty":`Invoice should not be an empty string`
                })
            }),
            deliveryNote:Joi.object({
                canCreateDeliveryNote:Joi.boolean().required().messages({
                    "any.boolean":`Can Create Delivery Note must be a boolean`,
                    "any.required": `Can Create Delivery Note is a required field`,
                    "string.empty": `Can Create Delivery Note should not be empty`
                }),
                canUpdateDeliveryNote:Joi.boolean().required().messages({
                    "any.boolean":`Can Update Delivery Note must be a boolean`,
                    "any.required": `Can Update Delivery Note is a required field`,
                    "string.empty": `Can Update Delivery Note should not be empty`
                }),
                canDeleteDeliveryNote:Joi.boolean().required().messages({
                    "any.boolean":`Can Delete Delivery Note must be a boolean`,
                    "any.required": `Can Delete Delivery Note is a required field`,
                    "string.empty": `Can Delete Delivery Note should not be empty`
             })
             .required().messages({
                "any.required":`Delivery Note is required field`,
                "string.empty":`Delivery Note should not be an empty string`
            })
        .required().messages({
            "any.required":`Rights are required`        
        })
            })
        })
    })
    return schema.validate(role);
}


module.exports.Role= Role;
module.exports.validateRole=validateRole;